import { useState } from "react";
import { ProgressBar } from "./ProgressBar";
import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { StepThree } from "./StepThree";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  country: string;
}

const TOTAL_STEPS = 3;

function validate(step: number, data: FormData): Partial<Record<keyof FormData, string>> {
  const errors: Partial<Record<keyof FormData, string>> = {};
  if (step >= 1) {
    if (!data.firstName.trim()) errors.firstName = "First name is required";
    if (!data.lastName.trim()) errors.lastName = "Last name is required";
    if (!data.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Please enter a valid email address";
    }
  }
  if (step >= 2) {
    if (!data.street.trim()) errors.street = "Street address is required";
    if (!data.city.trim()) errors.city = "City is required";
    if (!data.country) errors.country = "Country is required";
  }
  return errors;
}

export function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [data, setData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    country: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  function handleChange(update: Partial<FormData>) {
    setData((prev) => ({ ...prev, ...update }));
    // Clear errors for changed fields
    const clearedKeys = Object.keys(update) as (keyof FormData)[];
    setErrors((prev) => {
      const next = { ...prev };
      clearedKeys.forEach((k) => delete next[k]);
      return next;
    });
  }

  function handleNext() {
    const stepErrors = validate(step, data);
    const relevantKeys =
      step === 1
        ? (["firstName", "lastName", "email"] as const)
        : (["street", "city", "country"] as const);
    const stepSpecificErrors = Object.fromEntries(
      relevantKeys.filter((k) => stepErrors[k]).map((k) => [k, stepErrors[k]]),
    ) as Partial<Record<keyof FormData, string>>;

    if (Object.keys(stepSpecificErrors).length > 0) {
      setErrors(stepSpecificErrors);
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    // Simulate async submission
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setIsComplete(true);
  }

  if (isComplete) {
    return (
      // TODO: use a live region or role="status" so AT announces the success message
      <div>
        <h2>✓ Form submitted successfully!</h2>
        <p>
          Thank you, {data.firstName}. We&apos;ll be in touch at {data.email}.
        </p>
      </div>
    );
  }

  return (
    <div>
      <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />
      {step === 1 && (
        <StepOne data={data} onChange={handleChange} errors={errors} onNext={handleNext} />
      )}
      {step === 2 && (
        <StepTwo
          data={data}
          onChange={handleChange}
          errors={errors}
          onNext={handleNext}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <StepThree
          data={data}
          onBack={() => setStep(2)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
