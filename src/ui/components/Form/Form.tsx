import React, { FunctionComponent } from 'react';

import Button from '../Button/Button';
import $ from './Form.module.css';

interface FormEntry {
  name: string;
  placeholder: string;
  // TODO: Defined a suitable type for extra props
  // This type should cover all different of attribute types
  extraProps: any;
}

interface FormProps {
    legend: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    submitButtonText: string;
    submitButtonDisabled?: boolean;
    children: React.ReactNode;
}

const Form: FunctionComponent<FormProps> = ({
    legend,
    onSubmit,
    submitButtonText,
    submitButtonDisabled = false,
    children
}) => {
    return (
        <form onSubmit={onSubmit}>
            <fieldset>
                <legend>{legend}</legend>
                {children}
                <Button type="submit" disabled={submitButtonDisabled}>
                    {submitButtonText}
                </Button>
            </fieldset>
        </form>
    );
};

export default Form;
