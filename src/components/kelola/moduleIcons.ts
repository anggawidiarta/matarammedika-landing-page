import { FileText, Hospital, Stethoscope, Tag, type LucideIcon } from "lucide-react";
import type { CmsModule } from "@/lib/kelola/constants";

export const MODULE_ICONS: Record<CmsModule, LucideIcon> = {
  layanan: Stethoscope,
  fasilitas: Hospital,
  promo: Tag,
  profil: FileText,
};
