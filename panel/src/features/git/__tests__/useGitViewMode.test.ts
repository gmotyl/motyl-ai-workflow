import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGitViewMode } from "../useGitViewMode";

describe("useGitViewMode", () => {
  it("defaults to flat", () => {
    const { result } = renderHook(() => useGitViewMode());
    expect(result.current[0]).toBe("flat");
  });

  it("switches to tree mode", () => {
    const { result } = renderHook(() => useGitViewMode());
    act(() => result.current[1]("tree"));
    expect(result.current[0]).toBe("tree");
  });

  it("persists across remounts", () => {
    const { result, unmount } = renderHook(() => useGitViewMode());
    act(() => result.current[1]("tree"));
    unmount();

    const { result: r2 } = renderHook(() => useGitViewMode());
    expect(r2.current[0]).toBe("tree");
  });

  it("falls back to flat for invalid stored value", () => {
    localStorage.setItem("panel-git-view-mode", "garbage");
    const { result } = renderHook(() => useGitViewMode());
    expect(result.current[0]).toBe("flat");
  });
});
