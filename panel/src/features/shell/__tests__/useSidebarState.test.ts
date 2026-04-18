import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSidebarState } from "../useSidebarState";

describe("useSidebarState", () => {
  it("defaults to expanded (true)", () => {
    const { result } = renderHook(() => useSidebarState("leftSidebar"));
    expect(result.current.expanded).toBe(true);
  });

  it("toggles collapsed/expanded", () => {
    const { result } = renderHook(() => useSidebarState("leftSidebar"));
    act(() => result.current.toggle());
    expect(result.current.expanded).toBe(false);
    act(() => result.current.toggle());
    expect(result.current.expanded).toBe(true);
  });

  it("persists state per key", () => {
    const { result, unmount } = renderHook(() => useSidebarState("rightSidebar"));
    act(() => result.current.toggle());
    expect(result.current.expanded).toBe(false);
    unmount();

    const { result: r2 } = renderHook(() => useSidebarState("rightSidebar"));
    expect(r2.current.expanded).toBe(false);

    const { result: r3 } = renderHook(() => useSidebarState("leftSidebar"));
    expect(r3.current.expanded).toBe(true);
  });
});
