import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NoticeForm } from "./NoticeForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
  }),
}));

describe("NoticeForm", () => {
  it("renders correctly", () => {
    render(<NoticeForm />);
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Official URL/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Save Notice/i })).toBeInTheDocument();
  });

  it("shows validation errors for invalid URL", async () => {
    render(<NoticeForm />);
    
    fireEvent.change(screen.getByLabelText(/Official URL/i), {
      target: { value: "not-a-url" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Save Notice/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Must be a valid URL/i)).toBeInTheDocument();
    });
  });
});
