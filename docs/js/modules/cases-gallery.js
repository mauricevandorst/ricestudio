const GALLERY_IMAGE_COLUMNS = [
	[
		{ src: "./assets/images/oottat-tattoo-2.jpg", alt: "Oottat Tattoo — Zaanse Tattooshop", href: "https://oottattattoo.nl/" },
		{ src: "./assets/images/studio-ieks-2.jpg", alt: "Studio IEKS — Lokale Artiestenstudio", href: "https://studioieks.nl/" },
		{ src: "./assets/images/oottat-tattoo.jpg", alt: "Oottat Tattoo — Zaanse Tattooshop", href: "https://oottattattoo.nl/" },
		{ src: "./assets/images/glamour-by-tink.jpg", alt: "Glamour by Tink — PMU-Salon & Academy", href: "https://glamourbytink.nl/" },
		{ src: "./assets/images/klimazon.jpg", alt: "Klimazon — Klimaat- & Zontechniek", href: "https://klimazon.nl/" },
		{ src: "./assets/images/klimazon-2.jpg", alt: "Klimazon — Klimaat- & Zontechniek", href: "https://klimazon.nl/" },
		{ src: "./assets/images/glamour-by-tink-2.jpg", alt: "Glamour by Tink — PMU-Salon & Academy", href: "https://glamourbytink.nl/" },
		{ src: "./assets/images/proper-beauty-salon-2.jpg", alt: "Proper Beauty Salon — Nagelsalon", href: "https://properbeautysalon.com/" },
	],
	[
		{ src: "./assets/images/studio-ieks.jpg", alt: "Studio IEKS — Lokale Artiestenstudio", href: "https://studioieks.nl/" },
		{ src: "./assets/images/klimazon.jpg", alt: "Klimazon — Klimaat- & Zontechniek", href: "https://klimazon.nl/" },
		{ src: "./assets/images/oottat-tattoo.jpg", alt: "Oottat Tattoo — Zaanse Tattooshop", href: "https://oottattattoo.nl/" },
		{ src: "./assets/images/glamour-by-tink-2.jpg", alt: "Glamour by Tink — PMU-Salon & Academy", href: "https://glamourbytink.nl/" },
		{ src: "./assets/images/studio-ieks-2.jpg", alt: "Studio IEKS — Lokale Artiestenstudio", href: "https://studioieks.nl/" },
		{ src: "./assets/images/oottat-tattoo-2.jpg", alt: "Oottat Tattoo — Zaanse Tattooshop", href: "https://oottattattoo.nl/" },
		{ src: "./assets/images/proper-beauty-salon-2.jpg", alt: "Proper Beauty Salon — Nagelsalon", href: "https://properbeautysalon.com/" },
		{ src: "./assets/images/glamour-by-tink.jpg", alt: "Glamour by Tink — PMU-Salon & Academy", href: "https://glamourbytink.nl/" },
	],
	[
		{ src: "./assets/images/oottat-tattoo.jpg", alt: "Oottat Tattoo — Zaanse Tattooshop", href: "https://oottattattoo.nl/" },
		{ src: "./assets/images/glamour-by-tink.jpg", alt: "Glamour by Tink — PMU-Salon & Academy", href: "https://glamourbytink.nl/" },
		{ src: "./assets/images/studio-ieks.jpg", alt: "Studio IEKS — Lokale Artiestenstudio", href: "https://studioieks.nl/" },
		{ src: "./assets/images/klimazon.jpg", alt: "Klimazon — Klimaat- & Zontechniek", href: "https://klimazon.nl/" },
		{ src: "./assets/images/klimazon-2.jpg", alt: "Klimazon — Klimaat- & Zontechniek", href: "https://klimazon.nl/" },
		{ src: "./assets/images/glamour-by-tink-2.jpg", alt: "Glamour by Tink — PMU-Salon & Academy", href: "https://glamourbytink.nl/" },
		{ src: "./assets/images/proper-beauty-salon-2.jpg", alt: "Proper Beauty Salon — Nagelsalon", href: "https://properbeautysalon.com/" },
		{ src: "./assets/images/oottat-tattoo-2.jpg", alt: "Oottat Tattoo — Zaanse Tattooshop", href: "https://oottattattoo.nl/" },
	],
];

const LOOP_REPEATS = 3;

export function initCasesGallery() {
	const tracks = [...document.querySelectorAll("[data-parallax-track][data-gallery-column]")];

	if (!tracks.length) {
		return;
	}

	tracks.forEach((track) => {
		const columnIndex = Number(track.dataset.galleryColumn ?? -1);
		const columnImages = GALLERY_IMAGE_COLUMNS[columnIndex];

		if (!Array.isArray(columnImages) || !columnImages.length) {
			return;
		}

		const fragment = document.createDocumentFragment();
		track.replaceChildren();

		for (let repeatIndex = 0; repeatIndex < LOOP_REPEATS; repeatIndex += 1) {
			columnImages.forEach(({ src, alt, href }) => {
				const link = document.createElement("a");
				link.href = href;
				link.target = "_blank";
				link.rel = "noopener noreferrer";
				link.className = "block overflow-hidden";

				if (repeatIndex > 0) {
					link.setAttribute("aria-hidden", "true");
					link.tabIndex = -1;
				} else {
					link.setAttribute("aria-label", `${alt} — bezoek website`);
				}

				const image = document.createElement("img");
				image.src = src;
				image.alt = repeatIndex === 0 ? alt : "";
				image.loading = "lazy";
				image.decoding = "async";
				image.className = "aspect-[16/9] h-full w-full object-cover";

				link.append(image);
				fragment.append(link);
			});
		}

		track.append(fragment);
	});
}
