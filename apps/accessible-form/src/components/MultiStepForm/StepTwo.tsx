// Step 2: Address information
// Same issues as StepOne — fix the accessibility problems.

const COUNTRIES = ["Brazil", "United States", "Canada", "Germany", "Japan", "Other"];

interface StepTwoData {
  street: string;
  city: string;
  country: string;
}

interface Props {
  data: StepTwoData;
  onChange: (data: Partial<StepTwoData>) => void;
  errors: Partial<Record<keyof StepTwoData, string>>;
  onNext: () => void;
  onBack: () => void;
}

export function StepTwo({ data, onChange, errors, onNext, onBack }: Props) {
  return (
    <div>
      <h2>Address</h2>

      <div className="field">
        <label htmlFor="street">Street address *</label>
        <input
          id="street"
          type="text"
          required
          aria-invalid={errors.street ? "true" : "false"}
          aria-describedby="street-error"
          value={data.street}
          onChange={(e) => onChange({ street: e.target.value })}
        />
        <span aria-live="assertive" id="street-error" className="error-message">{errors.street ?? ""}</span>
      </div>

      <div className="field">
        <label htmlFor="city">City *</label>
        <input
          id="city"
          type="text"
          required
          aria-invalid={errors.city ? "true" : "false"}
          aria-describedby="city-error"
          value={data.city}
          onChange={(e) => onChange({ city: e.target.value })}
        />
        <span aria-live="assertive" id="city-error" className="error-message">{errors.city ?? ""}</span>
      </div>

      <div className="field">
        {/* TODO: ComboBox here instead of plain <select> once ComboBox is implemented */}
        <label htmlFor="country">Country *</label>
        <select
          id="country"
          required
          aria-invalid={errors.country ? "true" : "false"}
          aria-describedby="country-error"
          value={data.country}
          onChange={(e) => onChange({ country: e.target.value })}
        >
          <option value="">Select a country</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <span aria-live="assertive" id="country-error" className="error-message">{errors.country ?? ""}</span>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button type="button" onClick={onBack}>← Back</button>
        <button type="button" onClick={onNext}>Next →</button>
      </div>
    </div>
  );
}
