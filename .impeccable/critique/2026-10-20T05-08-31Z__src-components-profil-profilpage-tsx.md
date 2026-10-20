---
target: profile page
total_score: 23
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 2
target_identity: "file:E:\\Code\\my-project\\matarammedika-landing-page\\src\\components\\profil\\ProfilPage.tsx"
target_fingerprint: "sha256:7bc78e0fbc555636fdd6c37533a6554d7eba3504840fd8177dbf5783a6559241"
target_path: "E:\\Code\\my-project\\matarammedika-landing-page\\src\\components\\profil\\ProfilPage.tsx"
timestamp: 2026-10-20T05-08-31Z
slug: src-components-profil-profilpage-tsx
---
Method: dual-agent (A: a03baf43b954ff21c · B: ac1a3d1b6a837d6bc)

# Critique: Profile page (src/components/profil/ProfilPage.tsx)

## Design Health Score: 23/32 (heuristics 7 and 10 n/a, Persuade surface) — Good (72%)

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Title stays "Profile"; unit name only in a small caption |
| 2 | Match System / Real World | 3 | "Profile" in English; CMS typos shown |
| 3 | User Control and Freedom | 3 | Inactive tab unreachable by keyboard |
| 4 | Consistency and Standards | 3 | Title case vs all-caps section headings |
| 5 | Error Prevention | 3 | Empty parts hidden gracefully |
| 6 | Recognition Rather Than Recall | 3 | 80x32 switch does not read as page-level control |
| 7 | Flexibility and Efficiency | n/a | Static info page |
| 8 | Aesthetic and Minimalist Design | 3 | Left panel of Tentang Kami mostly empty |
| 9 | Error Recovery | 2 | No empty state when CMS is empty |
| 10 | Help and Documentation | n/a | Not applicable |

## Design Specificity Verdict
Category-interchangeable with a few authored moments. Well-executed template; nothing says Mataram or Lombok, no photo, no shared-address signal. Detector: 1 advisory (28px font size, false positive: documented mobile headline step). No overflow, no console errors.

## Priority Issues
- [P0 keyboard/screen reader] Other unit unreachable without a mouse: inactive tab tabindex=-1, no arrow keys, no aria-controls/tabpanel, no announcement. Fix: full WAI-ARIA tabs pattern. Command: harden.
- [P1] Switch small (80x32), inactive segment 3.54:1, title does not name the unit. Fix: 44px+ segments with icons, title "Profil Klinik/Apotek". Command: layout.
- [P1] Contrast: white text on gradient 2.77:1 (CTA paragraph 2.53:1), header nav links 2.63:1. Fix: darken green end / keep text on blue side, drop 0.8 opacity on nav. Command: colorize.
- [P2] Tentang Kami card is the main content but least designed: empty left panel, monolithic paragraph, Visi gradient card louder. Fix: photo + facts strip + split paragraph. Command: layout.
- [P2] Misi card stretched with empty space, gradient badges dilute the action signal; CTA copy clumsy, hard-coded, no WhatsApp mention. Command: clarify.
- [P3] No polite empty state when CMS returns nothing.

## Persona Red Flags
- Jordan: English "Profile", does not notice the switch, does not know the CTA opens WhatsApp.
- Sam: cannot reach Apotek tab by keyboard; low contrast on nav and gradient text.
- Casey: CTA about 3000px down on mobile, 32px switch, small badges.

## Minor Observations
- Targets under 44px: desktop nav links (40/36px), footer links (32px).
- Enter on the active tab rewrites URL without query (two URL forms).
- replaceState: Back does not restore the previous unit.
- Four images with alt="" (verify decorative).

## Questions to Consider
- Would a visitor know this is Lombok if photo and address were removed?
- Should the CTA come before three "who we are" blocks?
- Are two large Klinik/Apotek entry cards more honest than a small switch?
- Is the Visi really the most persuasive thing to show?
