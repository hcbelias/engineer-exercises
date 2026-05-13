interface Props {
  onClick: () => void;
}

export function ModalTrigger({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        background: "#4f46e5",
        color: "#fff",
        border: "none",
        borderRadius: 6,
      }}
    >
      Open modal
    </button>
  );
}
