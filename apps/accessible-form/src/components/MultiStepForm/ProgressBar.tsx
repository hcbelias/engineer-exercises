// TODO: Implement an accessible progress bar for the multi-step form.
//
// Assistive technology must be able to communicate the user's current position
// in the form — including which step they are on, the total number of steps,
// and which step is active. Completed and upcoming steps should be visually
// distinct with sufficient colour contrast.
//
// Props:
//   currentStep: number  (1-indexed)
//   totalSteps: number

interface Props {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: Props) {
  // TODO: implement
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{ color: "#6b7280", fontSize: 14 }}>
        Step {currentStep} of {totalSteps}
        {/* TODO: replace with an accessible progress indicator */}
      </p>
    </div>
  );
}
