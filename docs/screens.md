# Screen Inventory

Derived from `docs/idea.md` — a tutorial platform for "step-by-step instructions for building apps using Microsoft Technologies," on-brand with objectsharp.com, with admin content management, OAuth2 + RBAC, and an 11-star UX target.

## Public (anonymous) screens
- **Home / Landing** — hero, value prop, featured tutorials, on-brand with objectsharp.com
- **Tutorial Catalog** — browseable list of step-by-step guides, filter by Microsoft tech (e.g., .NET, Azure, Blazor)
- **Tutorial Detail** — individual step-by-step walkthrough (the core content experience)
- **Category / Tag pages** — grouped tutorials
- **Search results**
- **About / Contact** — standard marketing pages
- **404 / Error**

## Auth screens
- **Sign in** (OAuth2 — Microsoft / Google / etc.)
- **OAuth callback / consent**
- **Access denied** (RBAC failure)

## Authenticated user screens
- **My Profile** — basic account info
- **Progress / Bookmarks** — saved or in-progress tutorials (supports the 11-star UX)

## Admin screens (sysadmin RBAC)
- **Admin Dashboard** — overview, recent edits, stats
- **Tutorial List (admin)** — CRUD table with search/filter
- **Tutorial Editor** — create/edit a tutorial with ordered steps, code blocks, images
- **Step Editor** — nested editor for individual steps (could be inline)
- **Category / Tag management**
- **Media library** — uploaded images/assets
- **User & Role management** — RBAC assignments
- **Audit log** — who changed what

## Responsive considerations
All screens must render well on xs / s / m / l / xl breakpoints. Particular attention:
- **Tutorial Detail** — code blocks are hard on mobile (horizontal scroll, copy button, font sizing)
- **Tutorial Editor** — likely desktop-first; mobile is view-only or degraded
