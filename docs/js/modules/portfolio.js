const portfolioItems = [
	{
		title: "Oottat Tattoo",
		subtitle: "Moderne website voor een Zaanse tattooshop",
		imageUrl: "../assets/images/oottat-tattoo-2.jpg",
	},
	{
		title: "Studio IEKS",
		subtitle: "Uitnodigende online aanwezigheid voor een lokale artiestenstudio",
		imageUrl: "../assets/images/studio-ieks-2.jpg",
	},
	{
		title: "Glamour by Tink",
		subtitle: "Stijlvolle website voor een PMU-salon & academy",
		imageUrl: "../assets/images/glamour-by-tink-2.jpg",
	},
	{
		title: "Klimazon",
		subtitle: "Professionele website voor een klimaat- & zontechniekbedrijf",
		imageUrl: "../assets/images/klimazon-2.jpg",
	},
	{
		title: "Proper Beauty Salon",
		subtitle: "Verzorgde webpresentatie voor een nagelsalon",
		imageUrl: "../assets/images/proper-beauty-salon-2.jpg",
	},
];

export function initPortfolio() {
	const grid = document.querySelector("[data-portfolio-grid]");

	if (!grid) {
		return;
	}

	const fragment = document.createDocumentFragment();

	portfolioItems.forEach(({ title, subtitle, imageUrl }) => {
		const article = document.createElement("article");
		article.className = "flex flex-col gap-4";

		const img = document.createElement("img");
		img.src = imageUrl;
		img.alt = title;
		img.className = "w-full aspect-[4/3] rounded-2xl object-cover";
		img.loading = "lazy";

		const textWrapper = document.createElement("div");
		textWrapper.className = "flex flex-col gap-1 px-1";

		const h2 = document.createElement("h2");
		h2.textContent = title;
		h2.className = "text-3xl font-black tracking-[-0.03em] text-slate-900 sm:text-4xl";

		const p = document.createElement("p");
		p.textContent = subtitle;
		p.className = "text-sm font-medium text-slate-500 sm:text-base";

		textWrapper.append(h2, p);
		article.append(img, textWrapper);
		fragment.appendChild(article);
	});

	grid.appendChild(fragment);
}
