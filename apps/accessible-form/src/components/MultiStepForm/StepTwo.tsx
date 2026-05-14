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
        <label>Street address *</label>
        <input
          type="text"
          value={data.street}
          onChange={(e) => onChange({ street: e.target.value })}
        />
        {errors.street && <span className="error-message">{errors.street}</span>}
      </div>

      <div className="field">
        <label>City *</label>
        <input type="text" value={data.city} onChange={(e) => onChange({ city: e.target.value })} />
        {errors.city && <span className="error-message">{errors.city}</span>}
      </div>

      <div className="field">
        {/* TODO: ComboBox here instead of plain <select> once ComboBox is implemented */}
        <label>Country *</label>
        <select value={data.country} onChange={(e) => onChange({ country: e.target.value })}>
          <option value="">Select a country</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.country && <span className="error-message">{errors.country}</span>}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={onBack}>← Back</button>
        <button onClick={onNext}>Next →</button>
      </div>
    </div>
  );
}
