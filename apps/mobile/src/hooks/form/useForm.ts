import { useState } from "react";

interface FormState {
  [key: string]: string;
}

interface UseFormReturn<T extends FormState> {
  formData: T;
  setField: (field: keyof T, value: string) => void;
  resetForm: () => void;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
}

export const useForm = <T extends FormState>(
  initialState: T
): UseFormReturn<T> => {
  const [formData, setFormData] = useState<T>(initialState);

  const setField = (field: keyof T, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialState);
  };

  return {
    formData,
    setField,
    resetForm,
    setFormData,
  };
};
