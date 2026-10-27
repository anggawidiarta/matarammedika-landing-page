/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    kelolaUser?: import("@/lib/kelola/sso").SsoUser;
  }
}
