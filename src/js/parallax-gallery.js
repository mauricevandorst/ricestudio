import { initOpposingParallaxGallery } from "./modules/opposing-parallax-gallery.js";
import { initPageVisibilityTitle } from "./modules/page-visibility-title.js";

const GALLERY_IMAGE_COLUMNS = [
	[
		{
			src: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1400",
			alt: "Stock image van team overleg",
		},
		{
			src: "https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=1400",
			alt: "Stock image van laptop en bureau",
		},
		{
			src: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1400",
			alt: "Stock image van brainstormsessie",
		},
	],
	[
		{
			src: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1400",
			alt: "Stock image van creative studio",
		},
		{
			src: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1400",
			alt: "Stock image van werkplek met schermen",
		},
		{
			src: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1400",
			alt: "Stock image van team collaboration",
		},
	],
	[
		{
			src: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1400",
			alt: "Stock image van productiviteit",
		},
		{
			src: "https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=1400",
			alt: "Stock image van team planning",
		},
		{
			src: "https://images.pexels.com/photos/3183173/pexels-photo-3183173.jpeg?auto=compress&cs=tinysrgb&w=1400",
			alt: "Stock image van moderne workspace",
		},
	],
];

const LOOP_REPEATS = 4;

initPageVisibilityTitle({
	delayToHiddenMs: 10500,
	delayToOriginalMs: 5500,
});

function renderParallaxGalleryImages() {
	const tracks = [...document.querySelectorAll("[data-parallax-track][data-gallery-column]")];

	tracks.forEach((track) => {
		const columnIndex = Number(track.dataset.galleryColumn ?? -1);
		const columnImages = GALLERY_IMAGE_COLUMNS[columnIndex];

		if (!Array.isArray(columnImages) || !columnImages.length) {
			return;
		}

		const fragment = document.createDocumentFragment();
		track.replaceChildren();

		for (let repeatIndex = 0; repeatIndex < LOOP_REPEATS; repeatIndex += 1) {
			columnImages.forEach(({ src, alt }) => {
				const linkButton = document.createElement("a");
				linkButton.href = "./#cases";
				linkButton.className = "block overflow-hidden bg-slate-900/70";
				linkButton.setAttribute("aria-label", `${alt} - bekijk cases`);

				if (repeatIndex > 0) {
					linkButton.setAttribute("aria-hidden", "true");
					linkButton.tabIndex = -1;
				}

				const image = document.createElement("img");
				image.src = src;
				image.alt = repeatIndex === 0 ? alt : "";
				image.loading = "lazy";
				image.decoding = "async";
				image.className = "aspect-[16/9] h-full w-full object-cover";

				linkButton.append(image);
				fragment.append(linkButton);
			});
		}

		track.append(fragment);
	});
}

renderParallaxGalleryImages();
initOpposingParallaxGallery();
