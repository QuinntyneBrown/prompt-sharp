# Prompt/Sharp Components

Angular atom library for Prompt/Sharp public, auth, and admin surfaces. Components are standalone Angular primitives that use `ChangeDetectionStrategy.OnPush`, signal `input()`, external HTML/SCSS files, and the shared SCSS tokens from `projects/tokens`.

## Atom Categories

Typography and metadata:

- `DisplayText` for hero/page display copy.
- `Eyebrow`, `Mono`, `LabelValue`, `Breadcrumb`, and `CodeCaption` for labels, ids, metadata, and code captions.
- `Wordmark` for inline and foot wordmarks.

Status and data markers:

- `Badge`, `Chip`, `DifficultyBadge`, `StatusDot`, `Avatar`, `Meter`, `Swatch`, `Stat`, and the `Skeleton*` placeholders.

Actions and navigation:

- `Button`, `IconButton`, `Fab`, `PaginationButton`, and `NavItem`.

Form and controls:

- `TextField`, `TextArea`, `SelectField`, `Checkbox`, `Radio`, `Switch`, `SegmentedControl`, `Tabs`, and `SearchField`.

Feedback, overlay, media, and surface:

- `DialogShell`, `Snackbar`, `Banner`, `EmptyState`, `SpinnerDot`, `Thumbnail`, `Surface`, and `DropZone`.

## Examples

```html
<lib-button variant="solid" size="md">Start tutorial</lib-button>

<lib-text-field
  label="Email"
  type="email"
  placeholder="you@example.com"
  (valueChange)="email = $event"
/>

<lib-dialog-shell
  [open]="publishing"
  headline="Publish tutorial"
  supportingText="Confirm the visibility and schedule."
  (closed)="publishing = false"
>
  <lib-select-field label="Visibility" [options]="visibilityOptions" />
  <div dialog-actions>
    <lib-button variant="text">Cancel</lib-button>
    <lib-button variant="solid">Publish</lib-button>
  </div>
</lib-dialog-shell>
```

## Skeleton Coverage Matrix

| Skeleton group | Atom coverage |
| --- | --- |
| Public nav/home/catalog/category/search | `wordmark`, `button`, `chip`, `eyebrow`, `skeleton-*`, `stat`, `display-text`, `surface`, `pagination-button`, `search-field` |
| Tutorial detail | `breadcrumb`, `display-text`, `chip`, `difficulty-badge`, `skeleton-*`, `code-caption`, `button`, `surface`, `nav-item` |
| Auth/error/access pages | `wordmark`, `display-text`, `button`, `empty-state`, `spinner-dot`, `text-field`, `skeleton-*` |
| Profile/progress | `avatar`, `label-value`, `badge`, `status-dot`, `meter`, `skeleton-line`, `surface`, `button` |
| Admin shell/table screens | `nav-item`, `icon-button`, `button`, `fab`, `chip`, `badge`, `status-dot`, `avatar`, `checkbox`, `text-field`, `tabs`, `surface`, `rule` |
| Admin tutorial editor | `text-field`, `text-area`, `select-field`, `segmented-control`, `chip`, `icon-button`, `skeleton-*`, `code-caption`, `surface`, `button` |
| Admin media/upload | `thumbnail`, `drop-zone`, `meter`, `icon-button`, `button`, `chip`, `surface`, `skeleton-tile` |
| Admin dialogs | `dialog-shell`, `button`, `icon-button`, `text-field`, `text-area`, `select-field`, `radio`, `switch`, `swatch`, `badge`, `label-value` |
| Notifications gallery | `snackbar`, `banner`, `button`, `icon-button`, `status-dot` |

## Validation

Run from `frontend`:

```bash
npx ng build components
npx ng test components --watch=false
```

Manual gates:

- Every atom is exported from `projects/components/src/public-api.ts`.
- Interactive atoms expose keyboard/focus states and an accessible name path.
- Atom styles stay token-driven and avoid page-specific widths, margins, and copy.
- Public and admin differences are handled by variants, tones, and slots rather than duplicate components.
