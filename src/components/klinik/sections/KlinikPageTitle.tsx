import { Segmented } from "../ui/ui";

type HeadingTag = "h1" | "h2";

export default function KlinikPageTitle({
  title,
  caption,
  as = "h1",
  align = "center",
  showSegmented = true,
  segmentedActive = "klinik",
  titleClassName = "",
}: {
  title: string;
  caption?: string;
  as?: HeadingTag;
  align?: "center" | "start";
  showSegmented?: boolean;
  segmentedActive?: "klinik" | "apotek";
  titleClassName?: string;
}) {
  const Heading = as;
  const alignClass =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col gap-3 ${alignClass}`}>
      <div
        className={`flex flex-wrap gap-3 ${align === "center" ? "justify-center items-center" : "items-center"}`}
      >
        <Heading
          className={`min-w-0 [overflow-wrap:anywhere] font-body text-[32px] font-semibold text-heading ${titleClassName}`}
        >
          {title}
        </Heading>
        {showSegmented ? <Segmented active={segmentedActive} /> : null}
      </div>
      {caption ? (
        <p className="max-w-[721px] font-body text-base leading-6 text-muted opacity-80">
          {caption}
        </p>
      ) : null}
    </div>
  );
}
