function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatEur(value) {
  return new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 0 }).format(value);
}

function initQuickPricing() {
  const quickPricing = document.getElementById("quick-pricing");
  if (!quickPricing) return;

  const modeToggle = document.getElementById("quick-mode-toggle");
  const adsToggle = document.getElementById("quick-ads-toggle");
  const tierSlider = document.getElementById("quick-tier-slider");
  const tierLabel = document.getElementById("quick-tier-label");
  const tierPrice = document.getElementById("quick-tier-price");
  const tierMonthly = document.getElementById("quick-tier-monthly");
  const quickPages = document.getElementById("quick-pages");
  const quickCustomSections = document.getElementById("quick-custom-sections");
  const quickFeatureList = document.getElementById("quick-feature-list");

  if (
    !modeToggle ||
    !adsToggle ||
    !tierSlider ||
    !tierLabel ||
    !tierPrice ||
    !tierMonthly ||
    !quickPages ||
    !quickCustomSections ||
    !quickFeatureList
  ) {
    return;
  }

  const quickPricingData = {
    website: [
      {
        label: "Budget website",
        price: 425,
        adsAddOn: 150,
        monthly: 19,
        adsMonthlyAddOn: 350,
        pages: {
          default: "1 pagina",
          ads: "1 pagina + advertentie-lander",
        },
        customSections: {
          default: "0 secties",
          ads: "1 sectie + campagneblok",
        },
        features: {
          default: [
            "• Mooie one-pager met strakke call-to-actions.",
            "• Mobielvriendelijk en technisch supersnel.",
            "• Basis contactmogelijkheid inbegrepen.",
          ],
          ads: [
            "• Google/Meta ads basisinrichting inbegrepen.",
            "• Pixel en conversiemeting gekoppeld.",
            "• Korte campagne-overdracht na livegang.",
          ],
        },
      },
      {
        label: "Kleine website",
        price: 750,
        adsAddOn: 150,
        monthly: 29,
        adsMonthlyAddOn: 350,
        pages: {
          default: "1-3 pagina's",
          ads: "1-3 pagina's + advertentie-lander",
        },
        customSections: {
          default: "2 secties",
          ads: "2 secties + campagneblok",
        },
        features: {
          default: ["• One-pager met duidelijke call-to-actions.", "• Responsief voor alle schermformaten.", "• Basis contactoptie en technische setup."],
          ads: ["• Google/Meta ads basisinrichting inbegrepen.", "• Pixel en conversiemeting gekoppeld.", "• Korte campagne-overdracht na livegang."],
        },
      },
      {
        label: "Standaard website",
        price: 1450,
        adsAddOn: 300,
        monthly: 29,
        adsMonthlyAddOn: 500,
        pages: {
          default: "Tot 5 pagina's",
          ads: "Tot 5 pagina's + landingspagina",
        },
        customSections: {
          default: "3 secties",
          ads: "3 secties + campagneblok",
        },
        features: {
          default: [
            "• Responsive design en basis SEO.", 
            "• Lokale SEO-pagina per regio.", 
            "• Contactformulier en analytics setup.", 
            "• Handover met duidelijke uitleg."
          ],
          ads: [
            "• Google/Meta ads basisinrichting inbegrepen.", 
            "• Tracking met pixel en conversiemeting.", 
            "• Campagne-overdracht met korte uitleg."
          ],
        },
      },
      {
        label: "Uitgebreide website",
        price: 3450,
        adsAddOn: 500,
        monthly: 59,
        adsMonthlyAddOn: 650,
        pages: {
          default: "Tot 12 pagina's",
          ads: "Tot 12 pagina's + 2 landingspagina's",
        },
        customSections: {
          default: "8 secties",
          ads: "8 secties + advertentieblokken",
        },
        features: {
          default: ["• Maatwerk pagina-opbouw met conversiefocus.", "• Blog/nieuws + SEO templates inbegrepen.", "• Koppelingen met agenda of CRM mogelijk.", "• Geavanceerde tools en calculators."],
          ads: ["• Google/Meta ads setup voor meerdere funnels.", "• Tracking, events en doelgroep-opbouw ingericht.", "• Maand 1 optimalisatieplan voor campagnes."],
        },
      }
    ],
    webshop: [
      {
        label: "Budget webshop",
        price: 950,
        adsAddOn: 100,
        monthly: 39,
        adsMonthlyAddOn: 170,
        pages: {
          default: "1 pagina",
          ads: "1 pagina + campagne-lander",
        },
        customSections: {
          default: "1 custom sectie",
          ads: "1 custom sectie + advertentieblok",
        },
        features: {
          default: [
            "• Compacte one-page shop met basis checkout.",
            "• Startklaar voor een klein aanbod.",
            "• Snelle livegang met duidelijke basisopzet.",
          ],
          ads: [
            "• Google Shopping/Meta basiskoppeling.",
            "• Tracking voor aankopen en add-to-cart.",
            "• Campagne-overdracht met korte uitleg.",
          ],
        },
      },
      {
        label: "Kleine webshop",
        price: 1450,
        adsAddOn: 250,
        monthly: 59,
        adsMonthlyAddOn: 170,
        pages: {
          default: "1-3 pagina's",
          ads: "1-3 pagina's + campagne-lander",
        },
        customSections: {
          default: "3 secties",
          ads: "3 secties + advertentieblok",
        },
        features: {
          default: ["• Compacte shop met basis checkout.", "• Tot 10 producten en categorie-indeling.", "• Snelle livegang met shopfunctionaliteit."],
          ads: ["• Google Shopping/Meta basiskoppeling.", "• Tracking voor aankopen en add-to-cart.", "• Campagne-overdracht met korte uitleg."],
        },
      },
      {
        label: "Standaard webshop",
        price: 2450,
        adsAddOn: 450,
        monthly: 59,
        adsMonthlyAddOn: 220,
        pages: {
          default: "Tot 6 pagina's",
          ads: "Tot 6 pagina's + campagne-lander",
        },
        customSections: {
          default: "4 secties",
          ads: "4 secties + advertentieblok",
        },
        features: {
          default: ["• Checkout, betaalmethode en verzendzones.", "• Categorieen en productfilters basis.", "• Korte training voor beheer en orders."],
          ads: ["• Google Shopping en Meta catalogus basis.", "• Conversietracking voor aankopen en add-to-cart.", "• Campagne-overdracht met advertentieadvies."],
        },
      },
      {
        label: "Uitgebreide webshop",
        price: 5450,
        adsAddOn: 700,
        monthly: 109,
        adsMonthlyAddOn: 300,
        pages: {
          default: "Tot 15 pagina's",
          ads: "Tot 15 pagina's + campagne-pagina's",
        },
        customSections: {
          default: "10 secties",
          ads: "10 secties + advertentieblokken",
        },
        features: {
          default: ["• Variaties, kortingsregels en bundels.", "• E-mailflows voor verlaten winkelwagens.", "• Koppeling met boekhouding of voorraad."],
          ads: ["• Google Shopping + Meta dynamic ads setup.", "• Datalayers en tracking voor ROAS-sturing.", "• Retargetingflow voor verlaten winkelwagens."],
        },
      }
    ],
  };

  const getMode = () => (quickPricing.dataset.quickMode === "webshop" ? "webshop" : "website");
  const getAdsEnabled = () => quickPricing.dataset.quickAds === "enabled";
  const getTierRange = () => {
    const mode = getMode();
    const options = quickPricingData[mode] || [];
    const min = 1;
    const max = Math.max(options.length, min);

    return { min, max };
  };
  const syncTierSliderRange = () => {
    const { min, max } = getTierRange();
    const value = clamp(Number(tierSlider.value || min), min, max);

    tierSlider.min = String(min);
    tierSlider.max = String(max);
    tierSlider.value = String(value);
  };
  const updateTierSliderProgress = () => {
    const { min, max } = getTierRange();
    const value = clamp(Number(tierSlider.value || min), min, max);
    const percent = ((value - min) / Math.max(max - min, 1)) * 100;

    tierSlider.style.setProperty("--slider-progress", `${percent}%`);
  };

  const updateQuickPricing = () => {
    const mode = getMode();
    const options = quickPricingData[mode];
    const { min, max } = getTierRange();
    const tier = clamp(Number(tierSlider.value || min), min, max);
    const selected = options[tier - 1] || options[0];
    const adsEnabled = getAdsEnabled();
    const totalPrice = selected.price + (adsEnabled ? selected.adsAddOn || 0 : 0);
    const totalMonthly = (selected.monthly || 0) + (adsEnabled ? selected.adsMonthlyAddOn || 0 : 0);
    const pages = adsEnabled ? selected.pages?.ads || "" : selected.pages?.default || "";
    const customSections = adsEnabled ? selected.customSections?.ads || "" : selected.customSections?.default || "";
    const features = adsEnabled ? selected.features?.ads || [] : selected.features?.default || [];

    tierLabel.textContent = selected.label;
    tierPrice.textContent = `€ ${formatEur(totalPrice)}`;
    tierMonthly.textContent = `€ ${formatEur(totalMonthly)}/m`;
    quickPages.textContent = pages;
    quickCustomSections.textContent = customSections;
    quickFeatureList.replaceChildren();
    features.forEach((feature) => {
      const item = document.createElement("li");
      item.textContent = feature;
      quickFeatureList.appendChild(item);
    });
    tierSlider.setAttribute("aria-valuetext", `${selected.label} (${mode}${adsEnabled ? ", met advertenties" : ""})`);
    updateTierSliderProgress();
  };

  const setMode = (mode) => {
    quickPricing.dataset.quickMode = mode;
    modeToggle.checked = mode === "webshop";
    syncTierSliderRange();

    updateQuickPricing();
  };

  const setAdsEnabled = (enabled) => {
    quickPricing.dataset.quickAds = enabled ? "enabled" : "disabled";
    adsToggle.checked = enabled;

    updateQuickPricing();
  };

  modeToggle.addEventListener("input", () => {
    setMode(modeToggle.checked ? "webshop" : "website");
  });

  adsToggle.addEventListener("input", () => {
    setAdsEnabled(adsToggle.checked);
  });

  tierSlider.addEventListener("input", updateQuickPricing);
  tierSlider.addEventListener("change", updateQuickPricing);

  setAdsEnabled(getAdsEnabled());
  setMode(getMode());
}
export function initWebsiteSimulator() {
  initQuickPricing();

  const simulator = document.getElementById("website-simulator");

  const simStageSelect = document.getElementById("sim-stage-select");
  const simGoalSelect = document.getElementById("sim-goal-select");
  const simSizeSelect = document.getElementById("sim-size-select");
  const simPages = document.getElementById("sim-pages");
  const simPagesValue = document.getElementById("sim-pages-value");
  const simDesignLevel = document.getElementById("sim-design-level");
  const simAdsEnabled = document.getElementById("sim-ads-enabled");
  const simMaintenance = document.getElementById("sim-maintenance");
  const simFastTrack = document.getElementById("sim-fast-track");

  const simPreviewTitle = document.getElementById("sim-preview-title");
  const simBuildEstimate = document.getElementById("sim-build-estimate");
  const simMonthlyEstimate = document.getElementById("sim-monthly-estimate");
  const simAdBudget = document.getElementById("sim-ad-budget");
  const simTimeline = document.getElementById("sim-timeline");
  const simFocus = document.getElementById("sim-focus");

  const updateSimulator = () => {
    if (
      !simulator ||
      !simStageSelect ||
      !simGoalSelect ||
      !simSizeSelect ||
      !simMaintenance ||
      !simAdsEnabled ||
      !simFastTrack
    ) {
      return;
    }

    const stage = simStageSelect.value || "start";
    const goal = simGoalSelect.value || "bookings";
    const size = simSizeSelect.value || "small";
    const pages = Number(simPages?.value || (size === "small" ? 5 : size === "medium" ? 9 : 14));
    const designLevel = simDesignLevel?.value || "clean";
    const adsEnabled = simAdsEnabled.checked;
    const maintenanceLevel = simMaintenance.value;
    const fastTrack = simFastTrack.checked;

    const sizeBaseOneTime = { small: 1450, medium: 2450, large: 3650 };
    const sizeBaseTimeline = { small: 3, medium: 5, large: 7 };
    const stageMultiplier = { start: 0.95, grow: 1.08 };
    const goalOneTime = { bookings: 250, seo: 450, ads: 350 };
    const goalMonthly = { bookings: 85, seo: 225, ads: 295 };
    const goalTimeline = { bookings: 0, seo: 1, ads: 1 };
    const goalFocus = {
      bookings: "meer afspraken via je website",
      seo: "beter gevonden worden in jouw regio",
      ads: "sneller extra aanvragen via campagnes",
    };
    const maintenanceLabel = {
      self: "Je regelt updates zelf",
      help: "Maandelijkse hulp en kleine updates",
      growth: "Doorlopende hulp en groei-optimalisatie",
    };
    const maintenanceMonthly = { self: 0, help: 95, growth: 220 };
    const designMultiplier = { clean: 1, animated: 1.14, premium: 1.24 };
    const designWeeks = { clean: 0, animated: 1, premium: 2 };

    const oneTimeRaw =
      ((sizeBaseOneTime[size] || 1450) + pages * 120) * (stageMultiplier[stage] || 1) * (designMultiplier[designLevel] || 1) +
      (goalOneTime[goal] || 0) +
      (adsEnabled ? 300 : 0) +
      (fastTrack ? 250 : 0);
    const monthlyRaw =
      (goalMonthly[goal] || 0) +
      (maintenanceMonthly[maintenanceLevel] || 0) +
      (adsEnabled ? 240 : 0);
    const mediaBudgetRaw = adsEnabled ? 450 : 0;

    const oneTimeMin = Math.round((oneTimeRaw * 0.9) / 50) * 50;
    const oneTimeMax = Math.round((oneTimeRaw * 1.1) / 50) * 50;
    const monthlyMin = Math.round((monthlyRaw * 0.9) / 10) * 10;
    const monthlyMax = Math.round((monthlyRaw * 1.1) / 10) * 10;

    const timelineBase = (sizeBaseTimeline[size] || 3) + Math.ceil(pages / 8) + (goalTimeline[goal] || 0) + (designWeeks[designLevel] || 0);
    const timelineMin = clamp(timelineBase - (fastTrack ? 1 : 0), 2, 14);
    const timelineMax = clamp(timelineMin + 2, 3, 16);

    if (simPreviewTitle) simPreviewTitle.textContent = "Duidelijke prijsindicatie voor jouw situatie";
    if (simPagesValue) simPagesValue.textContent = `${pages} pagina's`;
    if (simBuildEstimate) simBuildEstimate.textContent = `EUR ${formatEur(oneTimeMin)} - ${formatEur(oneTimeMax)}`;
    if (simMonthlyEstimate) simMonthlyEstimate.textContent = `EUR ${formatEur(monthlyMin)} - ${formatEur(monthlyMax)}/m`;
    if (simAdBudget) {
      simAdBudget.textContent = mediaBudgetRaw > 0 ? `EUR ${formatEur(mediaBudgetRaw)}/m` : "Niet gekozen";
    }
    if (simTimeline) simTimeline.textContent = `${timelineMin}-${timelineMax} weken`;
    if (simFocus) {
      simFocus.textContent =
        goal === "bookings"
          ? "Een duidelijke website die meer afspraken oplevert."
          : goal === "seo"
            ? "Beter zichtbaar voor klanten in jouw buurt."
            : "Sneller nieuwe aanvragen met extra bereik.";
    }
  };

  if (!simulator) {
    return;
  }

  [simStageSelect, simGoalSelect, simSizeSelect, simPages, simDesignLevel, simAdsEnabled, simMaintenance, simFastTrack].forEach((node) => {
    if (!node) return;
    node.addEventListener("input", updateSimulator);
    node.addEventListener("change", updateSimulator);
  });

  updateSimulator();
}
