declare module '*.jpeg' {
    const value: string;
    export default value;
  }
  
  declare module '*.jpg' {
    const value: string;
    export default value;
  }

  declare module '*.png' {
    const value: string;
    export default value;
  }



  declare module "*.svg" {
    const content: string;
    export default content;
  }


  declare module "react-country-state-fields" {
    export const CountryPicker: React.FC<{
      value: string;
      onChange: (value: string) => void;
      placeholder?: string;
      dropdownStyles?: object;
      textStyle?: object;
    }>;
  
    export const StatePicker: React.FC<{
      country: string;
      value: string;
      onChange: (value: string) => void;
      placeholder?: string;
      dropdownStyles?: object;
      textStyle?: object;
    }>;
  }
  