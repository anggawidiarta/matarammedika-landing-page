import Switch from "@/components/kelola/ui/Switch";

type PublishToggleProps = {
  checked: boolean;
  label: string;
  onChange: (next: boolean) => void;
  title?: string;
  className?: string;
};

export default function PublishToggle({
  checked,
  label,
  onChange,
  title = "Tampilkan di situs setelah disimpan",
  className = "",
}: PublishToggleProps) {
  return (
    <div
      className={`bg-surface-tint flex min-h-11 items-center justify-between gap-3 rounded-lg pr-1 pl-3.5 ${className}`}
    >
      <span className="text-sm font-semibold">{title}</span>
      <Switch checked={checked} label={label} onChange={onChange} />
    </div>
  );
}
