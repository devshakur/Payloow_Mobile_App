import AppFormPicker from "@/components/custom/forms/AppFormDropDownPickerWithSearch";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import { FunctionComponent } from "react";
import ninemobile from "../../../../assets/images/custom/svg/9mobile.svg";
import airtel from "../../../../assets/images/custom/svg/airtel.svg";
import glo from "../../../../assets/images/custom/svg/glo.svg";
import mtn from "../../../../assets/images/custom/svg/mtn.svg";

const Bill: FunctionComponent<object> = () => {
  const networks = [
    { label: "MTN", value: "mtn", icon: mtn },
    { label: "Airtel", value: "mtn", icon: airtel },
    { label: "Glo", value: "mtn", icon: glo },
    { label: "9Mobile", value: "mtn", icon: ninemobile },
  ];

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <AppFormPicker
        placeholder="Select a State"
        name="networks"
        data={networks}
      />
    </Screen>
  );
};

export default Bill;
