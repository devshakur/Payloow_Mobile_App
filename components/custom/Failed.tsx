import { Colors } from "@/constants/Colors";
import React, { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

interface FailedProps {}

const Failed: FunctionComponent<FailedProps> = () => {
  return (
    <View style={styles.container}>
      {/* Hexagon */}
      <Svg width="63" height="70" viewBox="0 0 63 70" fill="none">
        <Path
          d="M27.9218 1.78945C30.1743 0.662985 32.8257 0.662986 35.0782 1.78945L47.18 7.84144L58.4721 15.2959C60.5739 16.6834 61.8996 18.9796 62.0503 21.4936L62.86 35L62.0503 48.5064C61.8996 51.0204 60.5739 53.3166 58.4721 54.7041L47.18 62.1586L35.0782 68.2106C32.8257 69.337 30.1743 69.337 27.9218 68.2106L15.82 62.1586L4.52793 54.7041C2.42614 53.3166 1.10041 51.0204 0.9497 48.5064L0.139999 35L0.9497 21.4936C1.10041 18.9796 2.42614 16.6834 4.52794 15.2959L15.82 7.84144L27.9218 1.78945Z"
          fill="#E02D3C"
          stroke="#FEF1F2"
          strokeWidth="4"
        />
      </Svg>

      {/* Checkmark */}
      <View style={styles.checkContainer}>
        <Svg width="31" height="30" viewBox="0 0 31 30" fill="none">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M23.7916 6.53259C24.3259 6.96975 24.4046 7.75728 23.9675 8.29158L13.4763 21.1142C12.628 22.151 11.1131 22.3349 10.0414 21.5311L6.00002 18.5C5.44774 18.0858 5.33581 17.3023 5.75002 16.75C6.16424 16.1978 6.94774 16.0858 7.50002 16.5L11.5414 19.5311L22.0326 6.70849C22.4697 6.17418 23.2573 6.09543 23.7916 6.53259Z"
            fill="white"
          />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  checkContainer: {
    position: "absolute",
    alignSelf: "center",
  },
});

export default Failed;
