import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDwellState } from "./useDwellState";

const VISIT_MARKER_KEY = "cor-sys-visit-marker-v1";

describe("useDwellState()", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    window.localStorage.clear();
  });

  it("starts in 'fresh' state for new visitors", () => {
    const { result } = renderHook(() => useDwellState());
    expect(result.current).toBe("fresh");
  });

  it("escalates to 'engaged' after 15 seconds", () => {
    const { result } = renderHook(() => useDwellState());
    expect(result.current).toBe("fresh");
    act(() => {
      vi.advanceTimersByTime(15_000);
    });
    expect(result.current).toBe("engaged");
  });

  it("escalates to 'committed' after 60 seconds", () => {
    const { result } = renderHook(() => useDwellState());
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(result.current).toBe("committed");
  });

  it("marks the visit in localStorage on first mount", () => {
    expect(window.localStorage.getItem(VISIT_MARKER_KEY)).toBeNull();
    renderHook(() => useDwellState());
    expect(window.localStorage.getItem(VISIT_MARKER_KEY)).toBe("1");
  });

  it("returns 'returning' immediately when the visit marker is already set", () => {
    window.localStorage.setItem(VISIT_MARKER_KEY, "1");
    const { result } = renderHook(() => useDwellState());
    expect(result.current).toBe("returning");
  });

  it("returning phase is sticky — does not escalate over time", () => {
    window.localStorage.setItem(VISIT_MARKER_KEY, "1");
    const { result } = renderHook(() => useDwellState());
    expect(result.current).toBe("returning");
    act(() => {
      vi.advanceTimersByTime(120_000);
    });
    expect(result.current).toBe("returning");
  });

  it("does not crash when localStorage throws (e.g. private mode)", () => {
    const original = Storage.prototype.getItem;
    Storage.prototype.getItem = () => {
      throw new Error("storage blocked");
    };
    try {
      expect(() => renderHook(() => useDwellState())).not.toThrow();
    } finally {
      Storage.prototype.getItem = original;
    }
  });
});
