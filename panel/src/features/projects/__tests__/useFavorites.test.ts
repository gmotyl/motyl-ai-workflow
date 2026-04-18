import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFavorites } from "../useFavorites";

describe("useFavorites", () => {
  it("starts with empty favorites", () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites.size).toBe(0);
  });

  it("toggles a favorite on and off", () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggle("metro"));
    expect(result.current.isFavorite("metro")).toBe(true);
    act(() => result.current.toggle("metro"));
    expect(result.current.isFavorite("metro")).toBe(false);
  });

  it("persists to localStorage", () => {
    const { result, unmount } = renderHook(() => useFavorites());
    act(() => result.current.toggle("ch"));
    unmount();

    const { result: result2 } = renderHook(() => useFavorites());
    expect(result2.current.isFavorite("ch")).toBe(true);
  });

  it("sortWithFavorites puts favorites first", () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggle("alokai"));

    const items = [{ name: "metro" }, { name: "alokai" }, { name: "ch" }];
    const sorted = result.current.sortWithFavorites(items);
    expect(sorted[0].name).toBe("alokai");
    expect(sorted.length).toBe(3);
  });
});
