import "./styles/global.scss";
import { useRef, useState } from "react";
import { SkipNav } from "./components/SkipNav";
import { MultiStepForm } from "./components/MultiStepForm";
import { Modal } from "./components/Modal";
import { ModalTrigger } from "./components/Modal/ModalTrigger";
import { ComboBox } from "./components/ComboBox";

// INTENTIONALLY BROKEN: This tab panel uses <div onClick> instead of proper
// ARIA tab semantics. It works for mouse users but is completely unusable
// with a keyboard or screen reader.
//
// TODO: Convert to a proper accessible tab pattern.
// Keyboard users must be able to navigate between tabs using arrow keys,
// and screen readers must understand which tab is selected and which panel it controls.
// Only the active tab should be reachable via the Tab key.

const TABS = [
  { id: "tab-form", label: "Multi-step Form", panelId: "panel-form" },
  { id: "tab-modal", label: "Modal Dialog", panelId: "panel-modal" },
  { id: "tab-combobox", label: "ComboBox", panelId: "panel-combobox" },
];

const FRUITS = [
  "Apple",
  "Apricot",
  "Banana",
  "Blueberry",
  "Cherry",
  "Fig",
  "Grape",
  "Kiwi",
  "Lemon",
  "Mango",
  "Orange",
  "Peach",
  "Pear",
  "Pineapple",
  "Plum",
  "Raspberry",
  "Strawberry",
  "Watermelon",
];

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFruit, setSelectedFruit] = useState("");
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  const focusTab = (index: number) => {
    setActiveTab(index);
    tabRefs.current[index]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      if (activeTab === TABS.length - 1) {
        focusTab(0);
        return;
      }
      focusTab(activeTab + 1);
    } else if (e.key === "ArrowLeft") {
      if (activeTab === 0) {
        focusTab(TABS.length - 1);
        return;
      }
      focusTab(activeTab - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusTab(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusTab(TABS.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const focusedIndex = tabRefs.current.findIndex((el) => el === document.activeElement);
      if (focusedIndex !== -1) focusTab(focusedIndex);
    }
  };

  return (
    <>
      <SkipNav />
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
          padding: "24px 16px",
          fontFamily: "sans-serif",
        }}
      >
        <header>
          <h1>Accessibility Workshop</h1>
          <p style={{ color: "#6b7280" }}>
            Each tab contains a broken UI component. Your job is to make it fully accessible.
          </p>
        </header>

        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: "2px solid #e5e7eb",
            marginBottom: 24,
          }}
          role="tablist"
        >
          {TABS.map((tab, i) => (
            <div
              role="tab"
              aria-selected={activeTab === i}
              tabIndex={activeTab === i ? 0 : -1}
              id={tab.id}
              key={tab.id}
              aria-controls={tab.panelId}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              onClick={() => focusTab(i)}
              onKeyDown={handleKeyDown}
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                borderBottom: activeTab === i ? "2px solid #4f46e5" : "2px solid transparent",
                marginBottom: -2,
                color: activeTab === i ? "#4f46e5" : "#374151",
                fontWeight: activeTab === i ? 600 : 400,
              }}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* TAB PANELS — needs role="tabpanel" etc */}
        <main id="main-content" tabIndex={-1}>
          {activeTab === 0 && (
            <div id={TABS[0].panelId} role="tabpanel" aria-labelledby={TABS[0].id}>
              <MultiStepForm />
            </div>
          )}

          {activeTab === 1 && (
            <div id={TABS[1].panelId} role="tabpanel" aria-labelledby={TABS[1].id}>
              <h2>Modal Dialog</h2>
              <p>Click the button below to open an accessible modal dialog.</p>
              <ModalTrigger onClick={() => setIsModalOpen(true)} />
              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Example Dialog"
              >
                <p>This modal should trap focus and announce itself to screen readers.</p>
                <p>Press Escape or click the close button to dismiss it.</p>
              </Modal>
            </div>
          )}

          {activeTab === 2 && (
            <div id={TABS[2].panelId} role="tabpanel" aria-labelledby={TABS[2].id}>
              <h2>ComboBox</h2>
              <p>
                A typeahead dropdown that must be navigable by keyboard and announced by screen
                readers.
              </p>
              <div style={{ maxWidth: 300, marginTop: 16 }}>
                <ComboBox
                  label="Favourite fruit"
                  options={FRUITS}
                  value={selectedFruit}
                  onChange={setSelectedFruit}
                />
                {selectedFruit && (
                  <p style={{ marginTop: 12 }}>
                    Selected: <strong>{selectedFruit}</strong>
                  </p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
