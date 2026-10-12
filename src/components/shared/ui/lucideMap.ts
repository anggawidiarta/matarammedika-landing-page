import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Baby,
  Brain,
  BrainCircuit,
  Cctv,
  CigaretteOff,
  ClipboardList,
  Clock,
  Droplets,
  Ear,
  Flame,
  HeartPulse,
  Smile,
  Sparkles,
  Stethoscope,
  Toilet,
  UserSearch,
  Wind,
} from "lucide-react";

export const klinikLucideIcons = {
  activity: Activity,
  baby: Baby,
  brain: Brain,
  brainCircuit: BrainCircuit,
  cctv: Cctv,
  cigaretteOff: CigaretteOff,
  clipboardList: ClipboardList,
  clock: Clock,
  droplets: Droplets,
  ear: Ear,
  flame: Flame,
  heartPulse: HeartPulse,
  lungs: Wind,
  sparkles: Sparkles,
  stethoscope: Stethoscope,
  toilet: Toilet,
  tooth: Smile,
  userSearch: UserSearch,
} as const satisfies Record<string, LucideIcon>;

export type KlinikLucideName = keyof typeof klinikLucideIcons;
