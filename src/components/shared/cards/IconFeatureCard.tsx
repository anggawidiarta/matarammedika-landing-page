import type { ReactNode } from "react";

type Layout = "stack" | "inline";
type TitleSize = "xl" | "2xl";

const titleSizeClass: Record<TitleSize, string> = {
  "2xl": "font-body text-2xl font-medium leading-[21px] text-black",
  xl: "font-body text-xl font-medium leading-[21px] text-black",
};

export default function IconFeatureCard({
  icon,
  title,
  body,
  layout = "stack",
  titleSize = "2xl",
  bodyClassName = "font-body text-sm leading-5 text-muted",
}: {
  icon: ReactNode;
  title: string;
  body: string;
  layout?: Layout;
  titleSize?: TitleSize;
  bodyClassName?: string;
}) {
  const articleClass =
    layout === "inline"
      ? "flex items-start gap-6 rounded-3xl bg-white px-8 py-5 shadow-card"
      : "flex flex-col gap-6 rounded-3xl bg-white px-8 py-5 shadow-card";

  return (
    <article className={articleClass}>
      {icon}
      <div className="flex flex-col gap-3">
        <h3 className={titleSizeClass[titleSize]}>{title}</h3>
        <p className={bodyClassName}>{body}</p>
      </div>
    </article>
  );
}
