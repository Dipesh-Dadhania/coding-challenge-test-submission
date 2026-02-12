import reducer, {
  addAddress,
  removeAddress,
  updateAddresses,
  selectAddress,
} from "../addressBookSlice";
import { Address } from "@/types";

describe("addressBookSlice", () => {
  const mockAddress1: Address = {
    id: "1",
    street: "Main St",
    city: "Melbourne",
    postcode: "3000",
    firstName: "atest",
    houseNumber: "1",
    lastName: "btest",
  };

  const mockAddress2: Address = {
    id: "2",
    street: "Queen St",
    city: "Sydney",
    postcode: "2000",
    firstName: "ctest",
    houseNumber: "2",
    lastName: "dtest",
  };

  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual({
      addresses: [],
    });
  });

  it("should handle addAddress", () => {
    const state = reducer(undefined, addAddress(mockAddress1));

    expect(state.addresses).toHaveLength(1);
    expect(state.addresses[0]).toEqual(mockAddress1);
  });

  it("should NOT add duplicate address by id", () => {
    const stateWithOne = reducer(undefined, addAddress(mockAddress1));
    const stateWithDuplicate = reducer(stateWithOne, addAddress(mockAddress1));

    expect(stateWithDuplicate.addresses).toHaveLength(1);
  });

  it("should handle removeAddress", () => {
    const stateWithTwo = reducer(
      undefined,
      updateAddresses([mockAddress1, mockAddress2]),
    );

    const stateAfterRemove = reducer(stateWithTwo, removeAddress("1"));

    expect(stateAfterRemove.addresses).toHaveLength(1);
    expect(stateAfterRemove.addresses[0].id).toBe("2");
  });

  it("should handle updateAddresses", () => {
    const updatedState = reducer(
      undefined,
      updateAddresses([mockAddress1, mockAddress2]),
    );

    expect(updatedState.addresses).toEqual([mockAddress1, mockAddress2]);
  });

  it("selectAddress should return addresses from state", () => {
    const mockState = {
      addressBook: {
        addresses: [mockAddress1, mockAddress2],
      },
    };

    const result = selectAddress(mockState as any);

    expect(result).toEqual([mockAddress1, mockAddress2]);
  });
});
