import { Platform } from "react-native";
import { Colors } from './Colors';


export const CustomTextStyle = {
  text: {
    color: Colors.app.dark,
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
  },
};

