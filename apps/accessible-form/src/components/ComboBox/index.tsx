import { useState, useId } from "react";
import { Option } from "./Option";

interface ComboBoxProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

// TODO: Implement an accessible ComboBox (typeahead dropdown)
//
// The input must communicate its state to assistive technology: whether the
// list is expanded, which option is currently highlighted, and what the list
// contains.
//
// Keyboard users must be able to open and close the list, navigate through
// options, select with Enter, and dismiss with Escape — all without a mouse.
// Clicking outside the component should also close the list.
//
// Options should filter as the user types.

export function ComboBox({ label, options, value, onChange }: ComboBoxProps) {
  const id = useId();
  const listboxId = `${id}-listbox`;
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [activeIndex, setActiveIndex] = useState(-1);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(inputValue.toLowerCase())
  );

  function handleKeyDown(_e: React.KeyboardEvent<HTMLInputElement>) {
    // TODO: handle keyboard navigation
  }

  return (
    <div style={{ position: "relative" }}>
      <label htmlFor={`${id}-input`}>{label}</label>
      <input
        id={`${id}-input`}
        // TODO: add the necessary ARIA attributes to communicate state to assistive technology
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsOpen(true);
          setActiveIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        style={{ marginTop: 4 }}
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            margin: 0,
            padding: 0,
            listStyle: "none",
            border: "1px solid #ccc",
            borderRadius: 4,
            background: "#fff",
            zIndex: 10,
            maxHeight: 200,
            overflowY: "auto",
          }}
        >
          {filteredOptions.map((opt, i) => (
            <Option
              key={opt}
              id={`${id}-option-${i}`}
              label={opt}
              isSelected={opt === value}
              isActive={i === activeIndex}
              onSelect={() => {
                onChange(opt);
                setInputValue(opt);
                setIsOpen(false);
                setActiveIndex(-1);
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
