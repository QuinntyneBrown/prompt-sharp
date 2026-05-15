# Prompt/Sharp Components

Angular atom library for Prompt/Sharp public, auth, and admin surfaces. Components are standalone Angular primitives that use `ChangeDetectionStrategy.OnPush`, signal `input()`, external HTML/SCSS files, and the shared SCSS tokens from `projects/tokens`.

## Atom Categories

Typography and metadata:

- `DisplayText` for hero/page display copy.
- `Eyebrow`, `Mono`, `Breadcrumb`, and `CodeCaption` for labels, ids, metadata, and code captions.
- `Wordmark` for inline and foot wordmarks.

Status and data markers:

- `Chip`, `DifficultyBadge`, `StatusDot`, `Avatar`, `Meter`, `Stat`, and `SpinnerDot`.

Actions and navigation:

- `Button`, `IconButton`, `PaginationButton`, and `NavItem`.

Form and controls:

- `TextField`, `TextArea`, `SelectField`, `Checkbox`, `Tabs`, and `SearchField`.

Feedback, overlay, media, and surface:

- `DialogShell`, `Snackbar`, `Banner`, `EmptyState`, `Thumbnail`, and `DropZone`.

## Public Surface Decisions

The frontend audit on 2026-05-15 found several complete atoms exported without any app or domain consumer. The library now keeps the public API to components that are actually used by `domain` or `promp-sharp`.

- Adopted: `SpinnerDot` is used for loading states across domain screens.
- Kept internal: `SkeletonTile` remains a private `Thumbnail` implementation detail and is no longer exported.
- Removed from the public surface and source tree until there is a real consumer: `Badge`, `Fab`, `Glyph`, `LabelValue`, `Radio`, `SegmentedControl`, `SkeletonCircle`, `SkeletonLine`, `Surface`, `Swatch`, and `Switch`.

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
| Public nav/home/catalog/category/search | `wordmark`, `button`, `chip`, `eyebrow`, `stat`, `display-text`, `pagination-button`, `search-field`, `spinner-dot` |
| Tutorial detail | `breadcrumb`, `display-text`, `chip`, `difficulty-badge`, `code-caption`, `button`, `nav-item`, `spinner-dot` |
| Auth/error/access pages | `wordmark`, `display-text`, `button`, `empty-state`, `spinner-dot`, `text-field` |
| Profile/progress | `avatar`, `status-dot`, `meter`, `button`, `spinner-dot` |
| Admin shell/table screens | `nav-item`, `icon-button`, `button`, `chip`, `status-dot`, `avatar`, `checkbox`, `text-field`, `tabs`, `rule`, `spinner-dot` |
| Admin tutorial editor | `text-field`, `text-area`, `select-field`, `chip`, `icon-button`, `code-caption`, `button`, `spinner-dot` |
| Admin media/upload | `thumbnail`, `drop-zone`, `meter`, `icon-button`, `button`, `chip`, `spinner-dot` |
| Admin dialogs | `dialog-shell`, `button`, `icon-button`, `text-field`, `text-area`, `select-field` |
| Notifications gallery | `snackbar`, `banner`, `button`, `icon-button`, `status-dot` |

## Validation

Run from `frontend`:

```bash
npx ng build components
npx ng test components --watch=false
```

Manual gates:

- Every exported atom has at least one domain or app consumer, except atoms documented as internal dependencies.
- Interactive atoms expose keyboard/focus states and an accessible name path.
- Atom styles stay token-driven and avoid page-specific widths, margins, and copy.
- Public and admin differences are handled by variants, tones, and slots rather than duplicate components.
