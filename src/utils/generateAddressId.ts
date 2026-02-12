import { Address } from "@/types";

/**
 * Generates a unique ID for an address based on its properties and person's name
 * @param address - The address object
 * @param firstName - First name of the person
 * @param lastName - Last name of the person
 * @returns A unique ID string
 */
export const generateAddressId = (
  address: Pick<Address, "street" | "houseNumber" | "postcode" | "city">,
  firstName: string,
  lastName: string,
): string => {
  return `${address.street}_${address.houseNumber}_${address.postcode}_${address.city}_${firstName}_${lastName}`.replace(
    /\s+/g,
    "_",
  );
};
