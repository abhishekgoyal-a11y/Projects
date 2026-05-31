import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the dashboard and toggles theme", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("heading", { name: /generate readme/i })).toBeInTheDocument();
    const toggle = screen.getByRole("button", { name: /switch to (dark|light) mode/i });
    const before = document.documentElement.dataset.theme;
    await user.click(toggle);
    const after = document.documentElement.dataset.theme;
    expect(after).toBe(before === "dark" ? "light" : "dark");
  });

  it("shows optional link fields", () => {
    render(<App />);

    expect(screen.getByRole("textbox", { name: /live demo link \(optional\)/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /video demo link \(optional\)/i })).toBeInTheDocument();
  });
});

