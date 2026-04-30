# Task: Fix portal navigation and content

---

## Purpose

Fix two issues in the portal:

1. Broken navigation (wrong file paths)
2. Duplicate/unclear onboarding text

---

## Context

- Portal is now served from root index.html
- All modules are in subfolders:
  - /bor-vi-bruke/
  - /implementering/
  - /ansvarlig-ki/

---

## Task 1 — Fix navigation paths

All routes must use root-relative navigation.

Replace incorrect patterns:

- "../bor-vi-bruke/..." → "./bor-vi-bruke/..."
- "../implementering/..." → "./implementering/..."
- "../ansvarlig-ki/..." → "./ansvarlig-ki/..."

---

## Task 2 — Clean onboarding text

Current issue:
- Two blocks repeat the same message
- Creates clutter and reduces clarity

---

### Keep ONE block:

"Veiledningsstøtte – ikke beslutninger..."

---

### Remove duplicate block:

"This is a guidance system..." (or similar paragraph repeating same idea)

---

## Constraints

- Do NOT modify layout structure
- Do NOT modify cards
- Do NOT change styling
- Do NOT introduce new content

Only:
- fix paths
- remove duplicate text

---

## Result

- Navigation works for all modules
- Portal reads clean and professional
