import type { CmsModule, CmsSource } from "@/lib/kelola/constants";

export type KelolaItem = {
  id: string;
  module: CmsModule;
  source: CmsSource;
  section: string | null;
  title: string;
  body: string;
  data: Record<string, unknown>;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type InstagramStatus = "publishing" | "published" | "failed";

export type InstagramPost = {
  id: string;
  item_id: string;
  status: InstagramStatus;
  permalink: string | null;
  error_message: string | null;
  created_at: string;
  published_at: string | null;
};
