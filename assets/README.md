# assets/

Image material that is **not** published with the site.

| Folder | What it holds |
| --- | --- |
| `originals/` | Full-resolution source photographs. The site uses the optimised WebP copies in `src/assets/`, generated from these by `scripts/optimize-images.mjs`. Keep them here: Astro copies every imported source file into the build output, so a 12 MB original inside `src/assets/` would ship 12 MB. |
| `unused/` | Images that no page references any more (design mockups, validator screenshots, retired photos). They stay in the repository for reference but are never deployed. |

Anything the site actually serves belongs in `src/assets/` (processed by `astro:assets`)
or in `public/` (copied verbatim).
