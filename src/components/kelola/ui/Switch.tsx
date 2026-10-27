type SwitchProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
};

export default function Switch({ checked, onChange, label, disabled }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="group focus-visible:outline-blue inline-flex size-11 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span
        aria-hidden
        className={`relative inline-block h-6 w-11 rounded-full transition-colors duration-200 ease-out motion-reduce:transition-none ${
          checked ? "bg-green" : "bg-heading/25"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out motion-reduce:transition-none ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}
