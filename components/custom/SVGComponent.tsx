import React, { FunctionComponent } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

interface SVGComponentProps {
  SvgFile: any;
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const SVGComponent: FunctionComponent<SVGComponentProps> = ({
  SvgFile,
  width,
  height,
  color,
  backgroundColor,
  size = 40,
  style,
  ...props
}) => {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          justifyContent: "center",
          alignItems: "center",
        },
        style, // Applying custom styles
      ]}
    >
      <SvgFile
        width={width || size * 0.6}
        height={height || size * 0.6}
        fill={color || "currentColor"}
        {...props}
      />
    </View>
  );
};

export default SVGComponent;
