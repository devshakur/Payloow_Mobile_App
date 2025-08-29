import utility from "@/app/api/utility";
import routes from "@/app/navigations/routes";
import AppText from "@/components/custom/AppText";
import AppForm from "@/components/custom/forms/AppForm";
import AppFormField from "@/components/custom/forms/AppFormField";
// import AppFormSelectDropDown from "@/components/custom/forms/AppFormPicker"; // no longer used
import SubmitButton from "@/components/custom/forms/SubmitButton";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFormikContext } from "formik";
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";

interface OptionType {
  label: string;
  value: string | number;
}

interface DataPlan {
  id: number;
  amount: number;
  size: string;
  validity: string;
}

interface NetworkCategories {
  [categoryName: string]: DataPlan[];
}

interface NetworkData {
  [networkName: string]: NetworkCategories;
}

interface ApiResponse {
  success: boolean;
  data: NetworkData;
}

interface TransformedPlan extends DataPlan {
  network: string;
  category: string;
}

type RootStackParamList = {
  DataSummary: {
    network: any;
    phone: any;
    planId: any;
    price?: any;
    selectedPlanType?: any;
    plans: OptionType[];
    validity: string;
  };
  Transactions: undefined;
};

interface DataProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const validationSchema = Yup.object().shape({
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^(\+234|0)[0-9]{10}$/, "Enter a valid Nigerian phone number"),
  network: Yup.string().required("Please select a network"),
  planType: Yup.string().required("Please select a data plan"),
});

const Data: FunctionComponent<DataProps> = ({ navigation }) => {
  const [plansLoading, setPlansLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [rawVariations, setRawVariations] = useState<TransformedPlan[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");

  const networks = useMemo(() => [
    { label: "MTN", value: "MTN", color: "#FFCC00" },
    { label: "Airtel", value: "AIRTEL", color: "#FF0000" },
    { label: "Glo", value: "GLO", color: "#00B04F" },
    { label: "9Mobile", value: "9MOBILE", color: "#055d3dff" },
  ], []);

  const fetchVariations = useCallback(async () => {
    try {
      setPlansLoading(true);
      setFetchError(null);

      const result = await utility.getVariations();

      // Apisauce response shape: { ok, data, status, problem }
      if (!result?.ok) {
        setFetchError("Unable to load data plans. Please try again.");
        return;
      }

      const body = result.data as ApiResponse | undefined;
      if (!body?.success || !body.data) {
        setFetchError("Unable to load data plans. Please try again.");
        return;
      }

      const variations: TransformedPlan[] = [];

      Object.entries(body.data).forEach(([networkName, categories]) => {
        Object.entries(categories as NetworkCategories).forEach(([categoryName, plans]) => {
          if (Array.isArray(plans)) {
            plans.forEach((plan) => {
              // Guard required fields
              if (plan && typeof plan.id === 'number') {
                variations.push({
                  id: plan.id,
                  amount: Number(plan.amount) || 0,
                  size: plan.size || '',
                  validity: plan.validity || '',
                  network: networkName,
                  category: categoryName,
                });
              }
            });
          }
        });
      });

      if (variations.length > 0) {
        setRawVariations(variations);
      } else {
        setFetchError("No data plans found.");
      }
    } catch {
      setFetchError("Network error loading plans");
    } finally {
      setPlansLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVariations();
  }, [fetchVariations]);

  useEffect(() => {
    setSelectedCategory("");
    setSelectedPlanId("");
  }, [selectedNetwork]);

  // Grouped plans by category for a selected network
  const groupedPlans = useMemo(() => {
    if (!selectedNetwork) return [] as { label: string; value: string; items: { label: string; value: string; raw: TransformedPlan }[] }[];

    const plansForNetwork = rawVariations.filter(
      (v) => v.network.toUpperCase() === selectedNetwork.toUpperCase()
    );

    const byCategory: Record<string, TransformedPlan[]> = {};
    plansForNetwork.forEach((plan) => {
      if (!byCategory[plan.category]) byCategory[plan.category] = [];
      byCategory[plan.category].push(plan);
    });

    const grouped: { label: string; value: string; items: { label: string; value: string; raw: TransformedPlan }[] }[] = [];

    Object.entries(byCategory).forEach(([category, plans]) => {
      grouped.push({
        label: category,
        value: category,
        items: plans.map((p) => ({
          label: `${p.size} - ₦${Number(p.amount).toLocaleString()}${p.validity ? ` (${p.validity})` : ""}`,
          value: p.id.toString(),
          raw: p,
        })),
      });
    });

    // sort categories alphabetically for consistency
    grouped.sort((a, b) => a.label.localeCompare(b.label));
    return grouped;
  }, [rawVariations, selectedNetwork]);

  // Plans list for selected category
  const categoryPlans = useMemo(() => {
    if (!selectedCategory) return [] as { label: string; value: string; raw: TransformedPlan }[];
    return (
      groupedPlans.find((g) => g.value === selectedCategory)?.items || []
    );
  }, [groupedPlans, selectedCategory]);

  const handleSubmit = ({ phone, network, planType }: { phone: string; network: string; planType: string }) => {
    const plan = rawVariations.find(p => p.id.toString() === planType);
    navigation.navigate(routes.DATA_SUMMARY, {
      network,
      phone,
      planId: planType,
      price: plan ? plan.amount.toString() : undefined,
      selectedPlanType: planType,
      plans: categoryPlans.map(p => ({ label: p.label, value: p.value })),
      validity: plan?.validity || "",
    });
  };

  // Child components consume Formik context internally to avoid undefined context before provider mounts
  const NetworkChips = () => {
    const { setFieldValue, errors, touched } = useFormikContext<any>();
    return (
      <View style={styles.section}>
        <AppText style={[styles.label, errors.network && touched.network && { color: 'red' }]}>Select Network</AppText>
        <View style={styles.networkRow}>
          {networks.map((net) => (
            <TouchableOpacity
              key={net.value}
              style={[
                styles.networkButton,
                selectedNetwork === net.value && { borderColor: net.color, backgroundColor: net.color + "15" },
                errors.network && touched.network && { borderColor: 'red' },
              ]}
              onPress={() => {
                setSelectedNetwork(net.value);
                setFieldValue('network', net.value);
                setFieldValue('planType', '');
                setSelectedPlanId('');
              }}
            >
              <AppText style={[styles.networkText, { color: net.color }]}>{net.label}</AppText>
            </TouchableOpacity>
          ))}
        </View>
        {errors.network && touched.network && <AppText style={styles.errorText}>{errors.network as string}</AppText>}
      </View>
    );
  };

  const CategoryChips = () => {
    const { setFieldValue } = useFormikContext<any>();
    if (!selectedNetwork) return null;
    return (
      <View style={styles.section}>
        <AppText style={styles.label}>Select Category</AppText>
        <View style={styles.chipsRow}>
          {groupedPlans.map(cat => (
            <TouchableOpacity
              key={cat.value}
              style={[styles.smallChip, selectedCategory === cat.value && styles.smallChipSelected]}
              onPress={() => {
                setSelectedCategory(cat.value);
                setSelectedPlanId('');
                setFieldValue('planType', '');
              }}
            >
              <AppText style={[styles.smallChipText, selectedCategory === cat.value && styles.smallChipTextSelected]}>{cat.label}</AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const PlansGrid = () => {
    const { setFieldValue, errors, touched } = useFormikContext<any>();
    if (!selectedCategory) return null;
    return (
      <View style={styles.section}>
        <AppText style={[styles.label, errors.planType && touched.planType && { color: 'red' }]}>Select Data Plan</AppText>
        {plansLoading && (
          <View style={styles.loaderRow}>
            <ActivityIndicator size="small" color={Colors.app.primary} />
            <AppText style={styles.loaderText}>Loading plans...</AppText>
          </View>
        )}
        {!plansLoading && fetchError && (
          <TouchableOpacity onPress={fetchVariations} style={styles.errorReload}>
            <AppText style={styles.errorReloadText}>{fetchError} Tap to retry.</AppText>
          </TouchableOpacity>
        )}
        {!plansLoading && !fetchError && (
          <View style={styles.plansWrap}>
            {categoryPlans.map(p => (
              <TouchableOpacity
                key={p.value}
                style={[styles.planCard, selectedPlanId === p.value && styles.planCardSelected]}
                onPress={() => {
                  setSelectedPlanId(p.value);
                  setFieldValue('planType', p.value);
                }}
              >
                <AppText style={styles.planSize}>{p.raw.size}</AppText>
                <AppText style={styles.planAmount}>₦{Number(p.raw.amount).toLocaleString()}</AppText>
                {!!p.raw.validity && <AppText style={styles.planValidity}>{p.raw.validity}</AppText>}
              </TouchableOpacity>
            ))}
            {selectedCategory && !categoryPlans.length && (
              <AppText style={styles.helperEmpty}>No plans in this category</AppText>
            )}
          </View>
        )}
        {errors.planType && touched.planType && <AppText style={styles.errorText}>{errors.planType as string}</AppText>}
      </View>
    );
  };

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.app.dark} />
          </TouchableOpacity>
          <AppText style={styles.title}>Buy Data</AppText>
          <TouchableOpacity onPress={() => navigation.navigate(routes.TRANSACTIONS)}>
            <MaterialCommunityIcons name="history" size={22} color={Colors.app.primary} />
          </TouchableOpacity>
        </View>

        <AppForm
          initialValues={{
            phone: "",
            network: "",
            planType: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
            <NetworkChips />
            <View style={styles.section}>
              <AppText style={styles.label}>Phone Number</AppText>
              <AppFormField
                name="phone"
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                autoCapitalize="none"
              />
            </View>
            <CategoryChips />
            <PlansGrid />
            <SubmitButton
              title="Continue"
              btnContainerStyle={styles.submitButton}
              titleStyle={styles.submitButtonText}
            />
          </ScrollView>
        </AppForm>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "DMSans-Bold",
    color: Colors.app.dark,
  },
  formContainer: {
    paddingBottom: 40,
    gap: 24,
  },
  section: {
    gap: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DMSans-Medium",
    color: Colors.app.dark,
    marginBottom: 4,
  },
submitButton: {
    backgroundColor: Colors.app.primary,
    width: '100%',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },

  submitButtonText: {
    color: Colors.app.white,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DMSans-Medium",
  },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  loaderText: {
    color: Colors.app.dark,
    fontSize: 12,
    fontFamily: "DMSans-Regular",
  },
  errorReload: {
    backgroundColor: Colors.app.lock,
    padding: 10,
    borderRadius: 8,
  },
  errorReloadText: {
    color: Colors.app.failed,
    fontSize: 12,
    fontFamily: "DMSans-Regular",
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.app.white,
    borderWidth: 1,
    borderColor: Colors.app.dark + '25',
  },
  chipSelected: {
    backgroundColor: Colors.app.primary,
    borderColor: Colors.app.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: "DMSans-Regular",
    color: Colors.app.dark,
  },
  chipTextSelected: {
    color: Colors.app.white,
  },
  networkRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  networkButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.app.dark + "30",
  },
  networkText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "DMSans-Regular",
  },
  smallChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: Colors.app.white,
    borderWidth: 1,
    borderColor: Colors.app.dark + '20',
    marginBottom: 6,
  },
  smallChipSelected: {
    backgroundColor: Colors.app.primary,
    borderColor: Colors.app.primary,
  },
  smallChipText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: "DMSans-Regular",
    color: Colors.app.dark,
  },
  smallChipTextSelected: {
    color: Colors.app.white,
    fontFamily: "DMSans-Medium",
  },
  plansWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  planCard: {
    width: '47%',
    backgroundColor: Colors.app.white,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.app.dark + '15',
    gap: 4,
  },
  planCardSelected: {
    borderColor: Colors.app.primary,
    backgroundColor: Colors.app.primary + '12',
  },
  planSize: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: "DMSans-Medium",
    color: Colors.app.dark,
  },
  planAmount: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: "DMSans-Medium",
    color: Colors.app.primary,
  },
  planValidity: {
    fontSize: 11,
    fontFamily: "DMSans-Regular",
    color: Colors.app.dark + '70',
  },
  errorText: {
    fontSize: 12,
    fontFamily: "DMSans-Regular",
    color: 'red',
    marginTop: 4,
  },
  helperEmpty: {
    fontSize: 12,
    fontFamily: "DMSans-Regular",
    color: Colors.app.dark + '60',
    marginTop: 8,
  },
});

export default Data;
