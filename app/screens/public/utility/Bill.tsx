import AppFormPicker from "@/components/custom/forms/AppFormPicker";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import React, { FunctionComponent } from "react";
import ninemobile from "../../../../assets/images/custom/svg/9mobile.svg";
import airtel from "../../../../assets/images/custom/svg/airtel.svg";
import glo from "../../../../assets/images/custom/svg/glo.svg";
import mtn from "../../../../assets/images/custom/svg/mtn.svg";

interface BillProps {}

const Bill: FunctionComponent<BillProps> = () => {
  const networks = [
    { label: "MTN", value: "mtn", icon: mtn },
    { label: "Airtel", value: "mtn", icon: airtel },
    { label: "Glo", value: "mtn", icon: glo },
    { label: "9Mobile", value: "mtn", icon: ninemobile },
  ];

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <AppFormPicker
        placeholder={{ label: "Select a State", value: null }}
        name="networks"
        items={networks}
      />
    </Screen>
  );
};

export default Bill;
