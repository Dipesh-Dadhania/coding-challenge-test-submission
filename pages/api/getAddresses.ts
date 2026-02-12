import type { NextApiRequest, NextApiResponse } from "next";

import generateMockAddresses from "../../src/utils/generateMockAddresses";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    query: { postcode, streetnumber },
  } = req;

  if (!postcode || !streetnumber) {
    return res.status(400).json({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode and street number fields mandatory!",
    });
  }

  /** Implementation of validation logic to ensure input value
   *  is all digits and non negative
   */
  const isStrictlyNumeric = (value: string) => {
    return /^\d+$/.test(value);
  };

  // Validate postcode and street number fields
  const fieldsToValidate = [
    { 
      value: postcode as string, 
      name: "Postcode",
      minLength: 4,
      minLengthError: "Postcode must be at least 4 digits!" // DO NOT MODIFY MSG - used for grading
    },
    { 
      value: streetnumber as string, 
      name: "Street Number",
      minLength: undefined,
      minLengthError: undefined
    },
  ];

  for (const field of fieldsToValidate) {
    // Check minimum length if specified
    if (field.minLength !== undefined && field.value.length < field.minLength) {
      return res.status(400).json({
        status: "error",
        // DO NOT MODIFY MSG - used for grading
        errormessage: field.minLengthError!,
      });
    }

    // Check if value is strictly numeric
    if (!isStrictlyNumeric(field.value)) {
      return res.status(400).json({
        status: "error",
        errormessage: `${field.name} must be all digits and non negative!`,
      });
    }
  }

  const mockAddresses = generateMockAddresses(
    postcode as string,
    streetnumber as string,
  );
  if (mockAddresses) {
    const timeout = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    // delay the response by 500ms - for loading status check
    await timeout(500);
    return res.status(200).json({
      status: "ok",
      details: mockAddresses,
    });
  }

  return res.status(404).json({
    status: "error",
    // DO NOT MODIFY MSG - used for grading
    errormessage: "No results found!",
  });
}
