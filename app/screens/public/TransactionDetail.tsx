import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import * as SAF from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import AppButton from "../../../components/custom/AppButton";
import { Colors } from "../../../constants/Colors";

type TransactionRes = {
  narration: string;
  amount: number;
  methodType: string;
  status: string;
  reference: string;
  merchant: string;
  createdAt: string;
};

const TransactionDetail = () => {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const sampleTransaction: TransactionRes = {
    narration: "Topup",
    amount: 5000,
    methodType: "Card",
    status: "success",
    reference: "REF123456",
    merchant: "EasyBuy",
    createdAt: new Date().toISOString(),
  };

  const getBase64Logo = async () => {
    const asset = Asset.fromModule(require("../../../assets/images/icon.png"));
    await asset.downloadAsync();
    const base64 = await FileSystem.readAsStringAsync(asset.localUri || "", {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/png;base64,${base64}`;
  };

  const generateHtml = async (item: TransactionRes) => {
    const logo = await getBase64Logo();
    return `
      <html>
        <head>
          <style>
            @page { size: A6; margin: 10mm; }
            body {
              font-family: Arial, sans-serif;
              padding: 10px;
              font-size: 20px;
              color: #222;
              display: flex;
              justify-content: center;
              align-item: center;
              flex-direction: column;
              gap: 10px
              
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .logo {
              height: 80px;
              margin-bottom: 10px;
            }
            .row {
              margin-bottom: 12px;
              font-size: 30
            }
            .label {
              font-weight: bold;
              display: inline-block;
              min-width: 120px;
            }
            .value {
              color: #000;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img class="logo" src="${logo}" />
            <h2>Transaction Receipt</h2>
          </div>
          ${[
            ["Narration", item.narration],
            ["Amount", `₦${item.amount.toLocaleString("en-NG")}`],
            ["Method", item.methodType],
            ["Status", item.status],
            ["Reference", item.reference],
            ["Merchant", item.merchant],
            ["Date", new Date(item.createdAt).toLocaleString()],
          ]
            .map(
              ([label, value]) =>
                `<div class="row"><span class="label">${label}:</span><span class="value">${value}</span></div>`
            )
            .join("")}
        </body>
      </html>
    `;
  };

  useEffect(() => {
    const prepare = async () => {
      const html = await generateHtml(sampleTransaction);
      setHtmlContent(html);
      setLoading(false);
    };
    prepare();
  }, []);

  const handleSave = async () => {
    if (!htmlContent) return;

    try {
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });
      const fileName = `receipt-${Date.now()}.pdf`;

      if (Platform.OS === "android") {
        const permissions =
          await SAF.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!permissions.granted) {
          Alert.alert(
            "Permission Denied",
            "You must grant directory access to save the file."
          );
          return;
        }

        let safeDir = permissions.directoryUri;

        // SAF.createFileAsync will fail if it's not a writable folder
        let destUri;
        try {
          destUri = await SAF.StorageAccessFramework.createFileAsync(
            safeDir,
            fileName,
            "application/pdf"
          );
        } catch (err) {
          Alert.alert(
            "Error",
            "The selected directory is not writable. Please choose another directory."
          );
          return;
        }

        const fileData = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await FileSystem.writeAsStringAsync(destUri, fileData, {
          encoding: FileSystem.EncodingType.Base64,
        });

        Alert.alert("Success", "Receipt saved to selected directory.");
      } else {
        const destination = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.copyAsync({ from: uri, to: destination });
        Alert.alert("Saved", `Saved to:\n${destination}`);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not save receipt.");
    }
  };

  const handleShare = async () => {
    if (!htmlContent) return;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Sharing not available on this device.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not share receipt.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receipt Preview</Text>

      <View style={styles.previewContainer}>
        {htmlContent ? (
          <WebView
            originWhitelist={["*"]}
            source={{ html: htmlContent }}
            style={styles.webview}
          />
        ) : (
          <Text style={styles.loadingText}>Loading Preview...</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <AppButton
          title="Save"
          onPress={handleSave}
          btnContainerStyle={styles.btn}
          titleStyle={styles.btnTitleStyle}
        />
        <AppButton
          title="Share"
          onPress={handleShare}
          btnContainerStyle={styles.btn}
          titleStyle={styles.btnTitleStyle}
        />
      </View>
    </View>
  );
};

export default TransactionDetail;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  previewContainer: {
    height: 250,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: "center",
    width: "70%",
    maxWidth: 400,
    backgroundColor: "#f9f9f9",
  },
  webview: {
    flex: 1,
    width: "100%",
    height: "50%",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },

  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: 10,
    width: "90%",
    alignSelf: "center",
  },
  btn: {
    backgroundColor: Colors.app.primary,
    width: "30%",
    color: Colors.app.white,
  },
  btnTitleStyle: {
    fontFamily: "DM Sans",
    color: Colors.app.white,
    fontWeight: "400",
    lineHeight: 20,
  },
});
