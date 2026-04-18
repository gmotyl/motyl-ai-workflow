import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BranchPicker from "../BranchPicker";

const branches = ["main", "develop", "feature/auth", "feature/search", "fix/login"];

describe("BranchPicker", () => {
  it("renders current branch value", () => {
    render(<BranchPicker branches={branches} value="develop" onChange={() => {}} />);
    expect(screen.getByText("develop")).toBeInTheDocument();
  });

  it("opens dropdown and shows branches on click", async () => {
    const user = userEvent.setup();
    render(<BranchPicker branches={branches} value="main" onChange={() => {}} />);
    await user.click(screen.getByText("main"));
    expect(screen.getByText("feature/auth")).toBeInTheDocument();
    expect(screen.getByText("fix/login")).toBeInTheDocument();
  });

  it("filters branches by typing", async () => {
    const user = userEvent.setup();
    render(<BranchPicker branches={branches} value="main" onChange={() => {}} />);
    await user.click(screen.getByText("main"));
    await user.type(screen.getByPlaceholderText("Filter branches..."), "feature");
    expect(screen.getByText("feature/auth")).toBeInTheDocument();
    expect(screen.getByText("feature/search")).toBeInTheDocument();
    expect(screen.queryByText("fix/login")).not.toBeInTheDocument();
  });

  it("calls onChange when branch selected", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<BranchPicker branches={branches} value="main" onChange={onChange} />);
    await user.click(screen.getByText("main"));
    await user.click(screen.getByText("develop"));
    expect(onChange).toHaveBeenCalledWith("develop");
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<BranchPicker branches={branches} value="main" onChange={() => {}} />);
    await user.click(screen.getByText("main"));
    expect(screen.getByPlaceholderText("Filter branches...")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByPlaceholderText("Filter branches...")).not.toBeInTheDocument();
  });

  it("shows placeholder when no value", () => {
    render(<BranchPicker branches={branches} value="" onChange={() => {}} placeholder="pick one" />);
    expect(screen.getByText("pick one")).toBeInTheDocument();
  });

  it("navigates with keyboard arrows and Enter", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<BranchPicker branches={branches} value="main" onChange={onChange} />);
    await user.click(screen.getByText("main"));
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    expect(onChange).toHaveBeenCalledWith("feature/auth");
  });
});
