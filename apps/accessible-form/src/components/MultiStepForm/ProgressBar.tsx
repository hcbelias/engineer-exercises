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
  return (
    <div role="group" aria-label="Form progress" style={{ marginBottom: 24 }}>
      <progress
        id="progress-bar"
        max={totalSteps}
        value={currentStep}
        aria-valuetext={`Step ${currentStep} of ${totalSteps}`}
        style={{ width: "100%", marginBottom: 12 }}
      />
      <ol
        aria-hidden="true"
        style={{ display: "flex", listStyle: "none", padding: 0, margin: 0, gap: 8 }}
      >
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;
          return (
            <li
              key={step}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "50%",
                fontSize: 14,
                fontWeight: isActive ? 700 : 400,
                backgroundColor: isCompleted ? "#1d4ed8" : isActive ? "#3b82f6" : "#e5e7eb",
                color: isCompleted || isActive ? "#ffffff" : "#374151",
                border: isActive ? "2px solid #1d4ed8" : "2px solid transparent",
              }}
            >
              {step}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
