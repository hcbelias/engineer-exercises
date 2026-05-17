// Step 3: Review & submit

import { useEffect } from "react";
import { useAnnounce } from "../../hooks/useAnnounce";

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
  const { announce } = useAnnounce();

  useEffect(() => {
    announce("Review your details: Name: " + data.firstName + " " + data.lastName + " Email: " + data.email + " Address: " + data.street + ", " + data.city + ", " + data.country);
  }, [announce, data.firstName, data.lastName, data.email, data.street, data.city, data.country]);

  return (
    <div>
      <div>
        <h2>Review your details</h2>

        <dl style={{ lineHeight: 2 }}>
          <dt>Name</dt>
          <dd>
            {data.firstName} {data.lastName}
          </dd>
          <dt>Email</dt>
          <dd>{data.email}</dd>
          <dt>Address</dt>
          <dd>
            {data.street}, {data.city}, {data.country}
          </dd>
        </dl>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button type="button" onClick={onBack} disabled={isSubmitting}>
          ← Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          style={{ background: "#4f46e5", color: "#fff" }}
        >
          {isSubmitting ? "Submitting…" : "Submit"}
        </button>
      </div>
    </div>
  );
}
