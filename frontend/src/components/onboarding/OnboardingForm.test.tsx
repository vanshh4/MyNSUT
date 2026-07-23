import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const replace = vi.fn();
const refreshAuth = vi.fn();
const submitOnboarding = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));
vi.mock("@/hooks/useAuth", () => ({ useAuth: () => ({ refreshAuth }) }));
vi.mock("@/lib/api/students", () => ({ submitOnboarding }));
vi.mock("@/components/ui/MotionButton", () => ({ MotionButton: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} /> }));

const { OnboardingForm } = await import("./OnboardingForm");

describe("OnboardingForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    submitOnboarding.mockResolvedValue({ onboardingCompleted: true, student: {} });
    refreshAuth.mockResolvedValue({ onboardingCompleted: true });
  });

  it("shows immediate roll-number preview", async () => {
    const user = userEvent.setup();
    render(<OnboardingForm />);
    await user.type(screen.getByLabelText(/UMS roll number/i), "2023uit3324");
    expect(screen.getByText("Information Technology")).toBeInTheDocument();
    expect(screen.getByText("2027")).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    const user = userEvent.setup();
    render(<OnboardingForm />);
    await user.click(screen.getByRole("button", { name: /complete onboarding/i }));
    expect(await screen.findByText(/enter your UMS roll number/i)).toBeInTheDocument();
    expect(screen.getByText(/select a valid section/i)).toBeInTheDocument();
  });

  it("submits normalized onboarding data and redirects", async () => {
    const user = userEvent.setup();
    render(<OnboardingForm />);
    await user.type(screen.getByLabelText(/UMS roll number/i), "2023uit3324");
    await user.selectOptions(screen.getByLabelText(/Section/i), "2");
    await user.click(screen.getByRole("button", { name: /complete onboarding/i }));
    await waitFor(() => expect(submitOnboarding).toHaveBeenCalledWith({ umsRollNumber: "2023UIT3324", section: "2" }));
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/dashboard"));
  });

  it("displays a backend error", async () => {
    submitOnboarding.mockRejectedValue(new Error("The corresponding class has not been created."));
    const user = userEvent.setup();
    render(<OnboardingForm />);
    await user.type(screen.getByLabelText(/UMS roll number/i), "2023UIT3324");
    await user.selectOptions(screen.getByLabelText(/Section/i), "2");
    await user.click(screen.getByRole("button", { name: /complete onboarding/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/class has not been created/i);
  });
});
