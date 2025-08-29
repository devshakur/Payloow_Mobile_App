import { Formik, FormikHelpers, FormikValues } from "formik";
import { ReactNode } from "react";

interface AppFormProps<T extends FormikValues> {
  initialValues: T;
  onSubmit: (
    values: T,
    formikHelpers: FormikHelpers<T>
  ) => void | Promise<void>;
  validationSchema?: any;
  children: ReactNode;
}

function AppForm<T extends FormikValues>({
  initialValues,
  onSubmit,
  validationSchema,
  children,
}: AppFormProps<T>) {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {() => children}
    </Formik>
  );
}

export default AppForm;
