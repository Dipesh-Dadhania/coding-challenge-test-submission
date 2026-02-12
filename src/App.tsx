import React from "react";
import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import Form from "@/components/Form/Form";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";
import useFormFields from "@/hooks/useFormFields";
import transformAddress, { RawAddressModel } from "./core/models/address";
import styles from "./App.module.css";
import { Address as AddressType } from "./types";

function App() {
  /**
   * Form fields states using custom hook
   */
  const {
    values: formFields,
    onChange: handleFieldChange,
    clearFields,
  } = useFormFields({
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: "",
  });

  /**
   * Results states
   */
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

  // Form field change handlers are now handled by the useFormFields hook

  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous results and errors
    setError(undefined);
    setAddresses([]);
    setIsLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
      const apiUrl = `${baseUrl}/api/getAddresses?postcode=${encodeURIComponent(formFields.postCode)}&streetnumber=${encodeURIComponent(formFields.houseNumber)}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errormessage || "Failed to fetch addresses");
      }

      if (data.status === "ok" && data.details) {
        // Transform addresses and add house number to each
        const transformedAddresses = data.details.map(
          (rawAddress: RawAddressModel) => {
            const transformed = transformAddress({
              ...rawAddress,
              houseNumber: formFields.houseNumber,
            });
            return transformed;
          },
        );

        setAddresses(transformedAddresses);
      } else {
        setError(data.errormessage || "No addresses found");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching addresses",
      );
    } finally {
      setIsLoading(false);
    }
  };

  /** TODO: Add basic validation to ensure first name and last name fields aren't empty
   * Use the following error message setError("First name and last name fields mandatory!")
   */
  const handlePersonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formFields.selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't",
      );
      return;
    }

    const foundAddress = addresses.find(
      (address) => address.id === formFields.selectedAddress,
    );

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    addAddress({
      ...foundAddress,
      firstName: formFields.firstName,
      lastName: formFields.lastName,
    });
  };

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        <Form
          legend="🏠 Find an address"
          onSubmit={handleAddressSubmit}
          submitButtonText={isLoading ? "Finding..." : "Find"}
          submitButtonDisabled={isLoading}
        >
          <div className={styles.formRow}>
            <InputText
              name="postCode"
              onChange={handleFieldChange}
              placeholder="Post Code"
              value={formFields.postCode}
            />
          </div>
          <div className={styles.formRow}>
            <InputText
              name="houseNumber"
              onChange={handleFieldChange}
              value={formFields.houseNumber}
              placeholder="House number"
            />
          </div>
        </Form>
        {isLoading && (
          <div
            style={{
              textAlign: "center",
              margin: "1rem 0",
              color: "var(--color-text-light)",
            }}
          >
            Loading addresses...
          </div>
        )}
        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={handleFieldChange}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {formFields.selectedAddress && (
          <Form
            legend="✏️ Add personal info to address"
            onSubmit={handlePersonSubmit}
            submitButtonText="Add to addressbook"
          >
            <div className={styles.formRow}>
              <InputText
                name="firstName"
                placeholder="First name"
                onChange={handleFieldChange}
                value={formFields.firstName}
              />
            </div>
            <div className={styles.formRow}>
              <InputText
                name="lastName"
                placeholder="Last name"
                onChange={handleFieldChange}
                value={formFields.lastName}
              />
            </div>
          </Form>
        )}

        {/* TODO: Create an <ErrorMessage /> component for displaying an error message */}
        {error && <ErrorMessage message={error} />}

        {/* TODO: Add a button to clear all form fields. 
        Button must look different from the default primary button, see design. 
        Button text name must be "Clear all fields"
        On Click, it must clear all form fields, remove all search results and clear all prior
        error messages
        */}
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
