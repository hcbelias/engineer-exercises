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
        {/* TODO: associate label with input, communicate required state and error state to assistive technology */}
        <label>First name *</label>
        <input
          type="text"
          value={data.firstName}
          onChange={(e) => onChange({ firstName: e.target.value })}
        />
        {/* TODO: ensure the error message is announced to screen readers and linked to its input */}
        {errors.firstName && <span className="error-message">{errors.firstName}</span>}
      </div>

      <div className="field">
        <label>Last name *</label>
        <input
          type="text"
          value={data.lastName}
          onChange={(e) => onChange({ lastName: e.target.value })}
        />
        {errors.lastName && <span className="error-message">{errors.lastName}</span>}
      </div>

      <div className="field">
        <label>Email address *</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      {/* TODO: prevent accidental form submission */}
      <button onClick={onNext}>Next →</button>
    </div>
  );
}
