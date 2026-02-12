import { renderHook, act } from "@testing-library/react";
import useFormFields from "../useFormFields";

describe("useFormFields hook", () => {
  it("should initialize with given values", () => {
    const { result } = renderHook(() =>
      useFormFields({ firstName: "Dipesh", lastName: "Dadhania" }),
    );

    expect(result.current.values).toEqual({
      firstName: "Dipesh",
      lastName: "Dadhania",
    });
  });

  it("should update field value using onChange", () => {
    const { result } = renderHook(() => useFormFields({ email: "" }));

    act(() => {
      result.current.onChange({
        target: { name: "email", value: "test@mail.com" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.values.email).toBe("test@mail.com");
  });

  it("should set a specific value using setValue", () => {
    const { result } = renderHook(() => useFormFields({ city: "" }));

    act(() => {
      result.current.setValue("city", "Melbourne");
    });

    expect(result.current.values.city).toBe("Melbourne");
  });

  it("should set multiple fields using setFields", () => {
    const { result } = renderHook(() =>
      useFormFields({ city: "", postcode: "" }),
    );

    act(() => {
      result.current.setFields({ city: "Sydney", postcode: "2000" });
    });

    expect(result.current.values).toEqual({
      city: "Sydney",
      postcode: "2000",
    });
  });

  it("should clear fields back to initial values", () => {
    const { result } = renderHook(() =>
      useFormFields({ username: "initialUser" }),
    );

    act(() => {
      result.current.setValue("username", "changedUser");
    });

    expect(result.current.values.username).toBe("changedUser");

    act(() => {
      result.current.clearFields();
    });

    expect(result.current.values.username).toBe("initialUser");
  });

  it("should merge new fields without removing existing ones", () => {
    const { result } = renderHook(() => useFormFields({ firstName: "Dipesh" }));

    act(() => {
      result.current.setFields({ lastName: "Dadhania" });
    });

    expect(result.current.values).toEqual({
      firstName: "Dipesh",
      lastName: "Dadhania",
    });
  });
});
