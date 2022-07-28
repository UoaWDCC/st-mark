import { renderHook } from "@testing-library/react-hooks";
import useFilterPeople from "./useFilterPeople";
import { IPerson } from "../../../types/schema";

export const mockPeople: IPerson[] = [
  { fullName: "John H. Jackson", plot: true },
  { fullName: "Mary Jones", plot: true },
  { fullName: "Harold Hesketh", plot: false },
  { fullName: "May Heywood", plot: true },
  { fullName: "Eliza C. Tonks", plot: false },
  { fullName: "Eliza J. Simmons", plot: true },
] as unknown as IPerson[];

describe("useFilterPeople", () => {
  it("Returns location grouped arrays if search term is empty", () => {
    const { result } = renderHook(() => useFilterPeople(mockPeople, ""));

    expect(result.current.locationKnown).toHaveLength(4);
    expect(result.current.locationUnknown).toHaveLength(2);
  });

  it("Retains order of people in returned arrays", () => {
    const { result } = renderHook(() => useFilterPeople(mockPeople, ""));

    expect(result.current.locationKnown[0].fullName).toBe("John H. Jackson");
    expect(result.current.locationKnown[1].fullName).toBe("Mary Jones");
    expect(result.current.locationKnown[2].fullName).toBe("May Heywood");
    expect(result.current.locationKnown[3].fullName).toBe("Eliza J. Simmons");

    expect(result.current.locationUnknown[0].fullName).toBe("Harold Hesketh");
    expect(result.current.locationUnknown[1].fullName).toBe("Eliza C. Tonks");
  });

  it("Returns location grouped arrays if search term is `i`", () => {
    const { result } = renderHook(() => useFilterPeople(mockPeople, "i"));

    expect(result.current.locationKnown).toHaveLength(1);
    expect(result.current.locationKnown[0].fullName).toBe("Eliza J. Simmons");

    expect(result.current.locationUnknown).toHaveLength(1);
    expect(result.current.locationUnknown[0].fullName).toBe("Eliza C. Tonks");
  });

  it("Returns empty arrays if people is empty", () => {
    const { result } = renderHook(() => useFilterPeople([], ""));

    expect(result.current.locationKnown).toHaveLength(0);
    expect(result.current.locationUnknown).toHaveLength(0);
  });

  it("Returns empty arrays if people is undefined", () => {
    const { result } = renderHook(() => useFilterPeople(undefined, ""));

    expect(result.current.locationKnown).toHaveLength(0);
    expect(result.current.locationUnknown).toHaveLength(0);
  });
});
