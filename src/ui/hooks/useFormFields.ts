import React from "react";

interface FormFieldsState {
    [key: string]: string;
}

interface UseFormFieldsReturn {
    values: FormFieldsState;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setValue: (name: string, value: string) => void;
    clearFields: () => void;
    setFields: (fields: FormFieldsState) => void;
}

/**
 * Custom hook for managing form fields in a generic way
 * @param initialValues - Object containing initial form field values
 * @returns Object with values, onChange handler, and utility functions
 */
export const useFormFields = (
    initialValues: FormFieldsState = {},
): UseFormFieldsReturn => {
    const [values, setValues] = React.useState<FormFieldsState>(initialValues);

    /**
     * Generic onChange handler for all form inputs
     * Extracts name and value from the event target
     */
    const onChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setValues((prev) => ({
                ...prev,
                [name]: value,
            }));
        },
        [],
    );

    /**
     * Utility function to set a specific field value programmatically
     */

    const setValue = React.useCallback((name: string, value: string) => {
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    /**
     * Clear all form fields (reset to initial values)
     */
    const clearFields = React.useCallback(() => {
        setValues(initialValues);
    }, [initialValues]);

    /**
     * Set multiple field values at once
     */
    const setFields = React.useCallback((fields: FormFieldsState) => {
        setValues((prev) => ({
            ...prev,
            ...fields,
        }));
    }, []);

    return {
        values,
        onChange,
        setValue,
        clearFields,
        setFields,
    };
};

export default useFormFields;
