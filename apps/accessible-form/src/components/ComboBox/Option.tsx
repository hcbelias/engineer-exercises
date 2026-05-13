interface Props {
  id: string;
  label: string;
  isSelected: boolean;
  isActive: boolean;
  onSelect: () => void;
}

// Pre-scaffolded option item for the ComboBox.
// The ARIA role and attributes are added by the parent ComboBox component.
export function Option({ id, label, isSelected, isActive, onSelect }: Props) {
  return (
    <li
      id={id}
      role="option"
      aria-selected={isSelected}
      onClick={onSelect}
      style={{
        padding: "8px 12px",
        cursor: "pointer",
        background: isActive ? "#e0e7ff" : isSelected ? "#f0fdf4" : "transparent",
        fontWeight: isSelected ? 600 : 400,
      }}
    >
      {label}
    </li>
  );
}
