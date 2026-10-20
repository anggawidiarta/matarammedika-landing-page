import whatsappIcon from "@/assets/icons/whatsapp.svg";

type WhatsAppIconProps = {
  size?: number;
  className?: string;
};

export default function WhatsAppIcon({ size = 24, className = "bg-white" }: WhatsAppIconProps) {
  const mask = `url(${whatsappIcon.src}) center / contain no-repeat`;
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 ${className}`}
      style={{ width: size, height: size, mask, WebkitMask: mask }}
    />
  );
}
