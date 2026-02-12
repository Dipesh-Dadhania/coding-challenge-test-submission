import { createMocks } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse } from "next";
import handle from "../getAddresses";
import generateMockAddresses from "../../../src/utils/generateMockAddresses";

jest.mock("../../../src/utils/generateMockAddresses");

describe("API Route: handle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if postcode or streetnumber missing", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {},
    });

    await handle(req as NextApiRequest, res as NextApiResponse);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      status: "error",
      errormessage: "Postcode and street number fields mandatory!",
    });
  });

  it("should return 400 if postcode length < 4", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: { postcode: "123", streetnumber: "10" },
    });

    await handle(req as NextApiRequest, res as NextApiResponse);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      status: "error",
      errormessage: "Postcode must be at least 4 digits!",
    });
  });

  it("should return 400 if postcode is not numeric", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: { postcode: "12AB", streetnumber: "10" },
    });

    await handle(req as NextApiRequest, res as NextApiResponse);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      status: "error",
      errormessage: "Postcode must be all digits and non negative!",
    });
  });

  it("should return 400 if streetnumber is not numeric", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: { postcode: "3000", streetnumber: "-10A" },
    });

    await handle(req as NextApiRequest, res as NextApiResponse);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      status: "error",
      errormessage: "Street Number must be all digits and non negative!",
    });
  });

  it("should return 200 with mock addresses when valid", async () => {
    (generateMockAddresses as jest.Mock).mockReturnValue([
      { address: "10 Main St, Melbourne 3000" },
    ]);

    const { req, res } = createMocks({
      method: "GET",
      query: { postcode: "3000", streetnumber: "10" },
    });

    await handle(req as NextApiRequest, res as NextApiResponse);

    expect(generateMockAddresses).toHaveBeenCalledWith("3000", "10");
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      status: "ok",
      details: [{ address: "10 Main St, Melbourne 3000" }],
    });
  });

  it("should return 404 if no addresses found", async () => {
    (generateMockAddresses as jest.Mock).mockReturnValue(null);

    const { req, res } = createMocks({
      method: "GET",
      query: { postcode: "3000", streetnumber: "10" },
    });

    await handle(req as NextApiRequest, res as NextApiResponse);

    expect(res._getStatusCode()).toBe(404);
    expect(res._getJSONData()).toEqual({
      status: "error",
      errormessage: "No results found!",
    });
  });
});
