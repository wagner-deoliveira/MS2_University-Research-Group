/**
 * Generates the optimised masters used by the site.
 *
 * The full-resolution photographs live in `assets/originals/` (kept in the
 * repository, never published). This script writes a WebP copy of each one
 * into `src/assets/`, capped at the size the site actually renders, and
 * Astro turns those into responsive srcsets.
 *
 * Keeping the originals out of `src/` matters: Astro copies every imported
 * source file into the build output, so a 12 MB portrait in `src/assets/`
 * would ship 12 MB even when only a 20 kB variant is displayed.
 *
 * Run with: bun run scripts/optimize-images.mjs
 */
import sharp from 'sharp';
import { mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';

const QUALITY = 82;

/** [source directory, destination directory, max width in px, output format] */
const RULES = [
	['assets/originals/people', 'src/assets/people', 400, 'webp'],
	['assets/originals/images/index', 'src/assets/images/index', 1600, 'webp'],
	['assets/originals/images/about', 'src/assets/images/about', 1200, 'webp'],
	['assets/originals/images/publications', 'src/assets/images/publications', 640, 'webp'],
	['assets/originals/images/logo', 'src/assets/images/logo', 256, 'png'],
];

/** Files that need a different cap than the one their directory uses. */
const OVERRIDES = {
	'F2N2_2025_3': 2560, // full-bleed hero
	'F2N2 (90)': 1440,
	'F2N2 (24)': 960,
	'F2N2 (12)': 960,
	'F2N2 (93)': 480,
	'F2N2 (77)': 480,
	'granada_logo2': 240,
};

const IMAGE = /\.(jpe?g|png)$/i;

async function run() {
	for (const [from, to, dirWidth, format] of RULES) {
		const files = (await readdir(from)).filter((f) => IMAGE.test(f));
		await rm(to, { recursive: true, force: true });
		await mkdir(to, { recursive: true });

		for (const file of files) {
			const base = path.parse(file).name;
			const width = OVERRIDES[base] ?? dirWidth;
			const dest = path.join(to, `${base}.${format === 'png' ? 'png' : 'webp'}`);

			const pipeline = sharp(path.join(from, file)).resize({
				width,
				withoutEnlargement: true,
			});
			await (format === 'png' ? pipeline.png({ compressionLevel: 9 }) : pipeline.webp({ quality: QUALITY })).toFile(dest);

			const { size } = await import('node:fs/promises').then((fs) => fs.stat(dest));
			console.log(`${file} -> ${path.relative('.', dest)} (${Math.round(size / 1024)} kB)`);
		}
	}
}

await run();
