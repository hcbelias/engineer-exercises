// Step 1: Personal information
// This step has WORKING HTML but is INTENTIONALLY missing all accessibility attributes.
// Your job is to make it fully accessible.
//
// Issues to fix:
// 1. Screen readers don't know which fields are mandatory
// 2. When a field has an error, assistive technology doesn't know which input caused it
// 3. Errors appear visually but are not announced to screen reader users
// 4. Inputs don't communicate their invalid state to assistive technology
// 5. The Next button may trigger unexpected form submission behaviour

interface StepOneData {
  firstName: string;
  lastName: string;
  email: string;
}

interface Props {
  data: StepOneData;
  onChange: (data: Partial<StepOneData>) => void;
  errors: Partial<Record<keyof StepOneData, string>>;
  onNext: () => void;
}

export function StepOne({ data, onChange, errors, onNext }: Props) {
  return (
    <div>
      <h2>Personal Information</h2>

      <div className="field">
        <label htmlFor="firstName">First name *</label>
        <input
          id="firstName"
          type="text"
          required
          aria-invalid={errors.firstName ? "true" : "false"}
          aria-describedby={errors.firstName ? "firstName-error" : undefined}
          value={data.firstName}
          onChange={(e) => onChange({ firstName: e.target.value })}
        />
        {errors.firstName && <span aria-live="assertive" id="firstName-error" className="error-message">{errors.firstName}</span>}
      </div>

      <div className="field">
        <label htmlFor="lastName">Last name *</label>
        <input
          id="lastName"
          type="text"
          required
          aria-invalid={errors.lastName ? "true" : "false"}
          aria-describedby={errors.lastName ? "lastName-error" : undefined}
          value={data.lastName}
          onChange={(e) => onChange({ lastName: e.target.value })}
        />
        {errors.lastName && <span aria-live="assertive" id="lastName-error" className="error-message">{errors.lastName}</span>}
      </div>

      <div className="field">
        <label htmlFor="email">Email address *</label>
        <input
          id="email"
          type="email"
          required
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
        />
        {errors.email && <span aria-live="assertive" id="email-error" className="error-message">{errors.email}</span>}
      </div>
      <button onClick={onNext} type="button">Next →</button>
    </div>
  );
}
