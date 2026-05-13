// Step 3: Review & submit

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  country: string;
}

interface Props {
  data: FormData;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function StepThree({ data, onBack, onSubmit, isSubmitting }: Props) {
  return (
    <div>
      <h2>Review your details</h2>

      {/* TODO: ensure screen readers announce the review content when this step loads */}

      <dl style={{ lineHeight: 2 }}>
        <dt>Name</dt>
        <dd>{data.firstName} {data.lastName}</dd>
        <dt>Email</dt>
        <dd>{data.email}</dd>
        <dt>Address</dt>
        <dd>{data.street}, {data.city}, {data.country}</dd>
      </dl>

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button onClick={onBack} disabled={isSubmitting}>← Back</button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          style={{ background: "#4f46e5", color: "#fff" }}
          // TODO: communicate to assistive technology when the form is being submitted
        >
          {isSubmitting ? "Submitting…" : "Submit"}
        </button>
      </div>
    </div>
  );
}
