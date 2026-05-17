import { useState, useId, useRef, useEffect } from "react";
import { Option } from "./Option";

interface ComboBoxProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export function ComboBox({ label, options, value, onChange }: ComboBoxProps) {
  const id = useId();
  const listboxId = `${id}-listbox`;
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(inputValue.toLowerCase()),
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(0);
        } else {
          setActiveIndex((i) => (i < filteredOptions.length - 1 ? i + 1 : 0));
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(filteredOptions.length - 1);
        } else {
          setActiveIndex((i) => (i > 0 ? i - 1 : filteredOptions.length - 1));
        }
        break;
      case "Enter":
        if (isOpen && activeIndex >= 0) {
          e.preventDefault();
          const selected = filteredOptions[activeIndex];
          onChange(selected);
          setInputValue(selected);
          setIsOpen(false);
          setActiveIndex(-1);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setInputValue(value);
        setActiveIndex(-1);
        break;
      case "Tab":
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  }

  const activeDescendant = activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined;

  return (
    <div style={{ position: "relative" }} ref={containerRef}>
      <label htmlFor={`${id}-input`}>{label}</label>
      <input
        id={`${id}-input`}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={activeDescendant}
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
