# Admin User Invite Dialog — UI Audit

- **Trigger:** Sign in as sysadmin → navigate to `/admin/users` → click **Invite** in the page header. (Editors do not see the Invite button — RBAC gates the trigger.)
- **Skeleton:** [`docs/skeletons/admin-user-invite-dialog.html`](../../skeletons/admin-user-invite-dialog.html)
- **Pattern:** B (chrome rules per [`admin-tutorial-dialog.md`](./admin-tutorial-dialog.md))
- **Bug log:** [`bugs/admin-user-invite-dialog.md`](../../bugs/admin-user-invite-dialog.md)
- **Live component:** `frontend/projects/domain/src/lib/admin/users/admin-user-invite-dialog` (create — sibling to `admin-users-table`)

---

## How to run this audit

1. Start API + frontend, sign in as sysadmin.
2. Navigate to `/admin/users`, click **Invite** filled-button in the page header.
3. Open `docs/skeletons/admin-user-invite-dialog.html` in a second tab.
4. Audit at 1440 / 1100 / 720 / 600 px.
5. Verify email validation (POST disabled until field is a valid RFC 5322 address) and the role-select default.
6. Log gaps in [`bugs/admin-user-invite-dialog.md`](../../bugs/admin-user-invite-dialog.md) using prefix `INVITE-DLG-`.

---

## Composition (skeleton lines 314-332)

```
<ps-admin-shell>
  ├─ <ps-admin-topbar>             (backdrop)
  ├─ <ps-admin-nav-rail>           (backdrop — Users active)
  └─ <main class="admin-main">
       └─ <ps-user-invite-dialog>
             ├─ <header class="page-header">   (breadcrumb Admin / Users, h1 Users and roles, summary 38 users, action Invite)
             └─ <md-dialog class="flow-dialog" open data-auto-open>
                   ├─ slot="headline"  → "Invite user"
                   ├─ slot="content"   → <form .dialog-form>
                   │     ├─ md-outlined-text-field "Email"   (value "new.editor@example.com")
                   │     ├─ md-outlined-select   "Role"     (sysadmin, editor [selected], viewer)
                   │     ├─ md-outlined-text-field "Message" (textarea, rows=3, value "Welcome to the Prompt/Sharp editorial workspace.")
                   │     └─ <div class="mono">Invitation expires in 7 days.</div>
                   └─ slot="actions"   → md-text-button Cancel + md-filled-button Send invite
```

Backdrop: Users page, no `.flow-underlay` (crisp behind the scrim).

---

## 1. Dialog chrome

Inherits Pattern B. **Base 560 px** width — no `wide-dialog` modifier.

- **Selector:** `md-dialog.flow-dialog`.
- **Max-width:** `560px`. **Shape:** `20px`. **Container color:** `#161C2C`.
- **Auto-open:** `data-auto-open`. **Dismissable:** Esc + scrim + Cancel.

### Checks
- [ ] Dialog renders at 560 px max-width (not 720 px).
- [ ] Standard Pattern B chrome.

---

## 2. `slot="headline"`

- **Exact text:** `Invite user` (sentence case, two words, no question mark, no leading icon).
- Plain `<div slot="headline">`.

### Checks
- [ ] Headline reads exactly `Invite user`.

---

## 3. `slot="content"`

`<form slot="content" method="dialog" class="dialog-form">` — grid, `gap: 16px`.

### 3.1 Email field
- `<md-outlined-text-field label="Email" value="new.editor@example.com">`.
- Label exactly `Email`. Skeleton sample value `new.editor@example.com`.
- Live component should set `type="email"` (skeleton omits it but Pattern B convention requires the type attribute for keyboard + autofill semantics).
- Validation: required + RFC 5322 email format. Supporting-text should appear on invalid blur with the message `Enter a valid email address` (Pattern B convention).

### 3.2 Role select
- `<md-outlined-select label="Role">` with three `<md-select-option>` children in this **exact** order:
  1. `sysadmin` (lowercase, no display capitalization in the skeleton)
  2. `editor` — **`selected`** by default
  3. `viewer`
- Each option uses `<div slot="headline">{role}</div>` — the label appears in the option list and as the field value.
- Default selection: `editor`. (This is intentional — most invites are for editors; sysadmin and viewer are the edge cases.)

### 3.3 Message textarea
- `<md-outlined-text-field label="Message" type="textarea" rows="3" value="Welcome to the Prompt/Sharp editorial workspace.">`.
- Label exactly `Message`. **Optional field** (not required — verify the live component does not mark it with an asterisk).
- **Sample value (verbatim):** `Welcome to the Prompt/Sharp editorial workspace.`
- The `/` in `Prompt/Sharp` should render as a regular forward slash — the wordmark italic-orange treatment is **not** applied inside textarea content (live text only, not styled HTML).

### 3.4 Mono footer note
- `<div class="mono">Invitation expires in 7 days.</div>` — Pattern B `.mono` (Roboto Flex 12 px / 0.04 em, color `--md-sys-color-on-surface-variant`).
- **Verbatim text:** `Invitation expires in 7 days.` (trailing period, sentence case).
- No `margin-bottom` style (unlike the captions inside Color/Icon blocks in the Category dialog).

### Checks
- [ ] Form has exactly 4 children in this order: Email, Role, Message, mono footer.
- [ ] Email field is required + uses `type="email"`.
- [ ] Role select shows three options in order: `sysadmin`, `editor`, `viewer`. Default is `editor`.
- [ ] Message textarea is **not** required; supports 3 rows visible; expands internally beyond that.
- [ ] Default message value matches the skeleton verbatim.
- [ ] Mono footer line reads **`Invitation expires in 7 days.`** with the trailing period, in Pattern B `.mono` style.

---

## 4. `slot="actions"`

- **Cancel** — `<md-text-button>Cancel</md-text-button>`.
- **Send invite** — `<md-filled-button>Send invite</md-filled-button>`. Default primary color.

### Checks
- [ ] Two buttons right-aligned: Cancel (text) then Send invite (filled).
- [ ] Send invite label is exactly `Send invite` — not `Invite`, not `Send`, not `Send invitation`.
- [ ] Send invite button disabled until the email is valid.
- [ ] During the in-flight POST the button disables to prevent double-fire.

---

## 5. Backdrop behavior

- No `.flow-underlay` wrapper. Users page crisp behind scrim.
- Page header: breadcrumb `Admin / Users`, h1 `Users and roles`, summary `38 users`, action `Invite` filled-button.

### Checks
- [ ] Users table beneath remains mounted and visible (only M3 scrim dims it).
- [ ] Nav rail's `Users` item is active (filled icon).

---

## 6. Responsive

Inherits Pattern B. ≤ 600 px goes full-screen edge-to-edge.

### Checks
- [ ] ≤ 600 px: full-screen, no rounded corners, textarea remains usable.

---

## 7. Bug logging procedure

Log every failure in [`bugs/admin-user-invite-dialog.md`](../../bugs/admin-user-invite-dialog.md) using `INVITE-DLG-NNN`.

---

## 8. Fix locations (cheat sheet)

| Symptom | Fix in |
|---------|--------|
| Email field accepts invalid addresses | `admin-user-invite-dialog.ts` — add Validators.email |
| Role default isn't `editor` | template — `selected` on the editor option, or component init form value |
| Role options uppercase / wrong order | options array — keep `sysadmin`, `editor`, `viewer` lowercase, in that order |
| Message field marked required | remove `required` attribute |
| Mono footer styled wrong | use Pattern B `.mono` from shared admin SCSS (Roboto Flex 12 px, 0.04 em) |
| Send invite label wrong | template — `Send invite` (sentence case, two words) |
| Send invite enabled when form invalid | bind `[disabled]="form.invalid \|\| form.pending"` |
