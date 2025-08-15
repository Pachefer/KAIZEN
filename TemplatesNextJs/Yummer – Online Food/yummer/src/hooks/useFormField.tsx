'use client';

import {useState} from 'react';

export const useFormField = <T extends Record<string, any>>(initialForm: T) => {
  const [form, setForm] = useState<T>(initialForm);

  const handleChangeField = (field: keyof T, label: string) => {
    const result = window.prompt(`Enter your ${label}`, form[field]);
    if (result !== null) {
      setForm((prev) => ({...prev, [field]: result}));
    }
  };

  return {
    form,
    setForm,
    handleChangeField,
  };
};
