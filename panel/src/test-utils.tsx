import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter, type MemoryRouterProps } from "react-router-dom";
import { ActiveFileProvider } from "./features/explorer/useActiveFile";
import { vi } from "vitest";
import type { ReactElement } from "react";

interface RouterRenderOptions extends RenderOptions {
  initialEntries?: MemoryRouterProps["initialEntries"];
}

export function renderWithRouter(
  ui: ReactElement,
  options: RouterRenderOptions = {},
) {
  const { initialEntries = ["/"], ...renderOptions } = options;
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ActiveFileProvider>{ui}</ActiveFileProvider>
    </MemoryRouter>,
    renderOptions,
  );
}

type FetchMap = Record<string, unknown>;

export function mockFetchResponses(map: FetchMap) {
  const mockFetch = vi.fn((input: string | URL | Request) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input.url;
    for (const [pattern, data] of Object.entries(map)) {
      if (url.includes(pattern)) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(data),
        } as Response);
      }
    }
    return Promise.resolve({
      ok: false,
      json: () => Promise.resolve({}),
    } as Response);
  });
  vi.stubGlobal("fetch", mockFetch);
  return mockFetch;
}
