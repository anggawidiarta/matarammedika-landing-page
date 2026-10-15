/** Icon vocabulary shared by static content, CMS rows, and the card components. */
export const KLINIK_ICON_NAMES = [
  "activity",
  "baby",
  "brain",
  "brainCircuit",
  "cctv",
  "cigaretteOff",
  "clipboardList",
  "clock",
  "droplets",
  "ear",
  "flame",
  "heartPulse",
  "lungs",
  "sparkles",
  "stethoscope",
  "toilet",
  "tooth",
  "userSearch",
] as const;
export type KlinikLucideName = (typeof KLINIK_ICON_NAMES)[number];

export const CIRCLE_TONES = ["blue", "green", "pink", "lilac", "mint", "red"] as const;
export type CircleTone = (typeof CIRCLE_TONES)[number];

export type IconDescriptor =
  | { kind: "lucide"; name: KlinikLucideName }
  | { kind: "lucideCircle"; name: KlinikLucideName; tone: CircleTone };

/** Display card shape shared by layanan / fasilitas static content and CMS-mapped items. */
export type FeatureItem = {
  title: string;
  body: string;
  icon: IconDescriptor;
};
