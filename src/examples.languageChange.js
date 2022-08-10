/* eslint-disable import/unambiguous */

/**
 * This is just a usage example.
 *
 * To see usage, you would need to import the build T variable
 */

const translations = {
  en: {
    LANGUAGE: "The current language is {{lang}}",
    BASICS: {
      PARTNER_MODEL: "Article"
    },
    BRAND: "Brand X",
    BRAND_pierone: "Pier One",
    COLORED_HOUSES: "{{count}} {{color}} house",
    COLORED_HOUSES_plural: "{{count}} {{color}} houses",
    COMPLEX_HOUSES_AND_HOTELS:
      'They have $t(COLORED_HOUSES, {"count": {{houses}}, "color": "{{color}}"}) and $t(HOTELS, {"count": {{hotels}} })',
    COMPOUND: "$t(BASICS.{{unit}}) from $t(BRAND)",
    CTA: "Dont forget to {{cta, uppercase}}",
    DOWNLOADS: {
      GENERATE_BUTTON: "Generate report"
    },
    FULL_NAME: "My name is {{name.first}} {{name.last}}",
    GENERATE_BUTTON: "Generate report for $t(BRAND)",
    HOUSES_AND_HOTELS:
      'They have $t(HOUSES, {"count": {{houses}} }) and $t(HOTELS, {"count": {{hotels}} })',
    HOTELS: "{{count}} hotel",
    HOTELS_plural: "{{count}} hotels",
    HOUSES: "{{count}} house",
    HOUSES_plural: "{{count}} houses",
    NAME: "My name is {{name}}",
    REPORTS_LOADING_TEXT: "{{count}} report is being generated...",
    REPORTS_LOADING_TEXT_plural: "{{count}} reports are being generated...",
    VAGUE_REPORTS_LOADING_TEXT: "A report is being generated...",
    VAGUE_REPORTS_LOADING_TEXT_plural: "Some reports are being generated..."
  },

  jp: {
    LANGUAGE: "現在の言語は{{lang}}です",
    BASICS: {
      PARTNER_MODEL: "論文"
    },
    BRAND: "ブランドX",
    BRAND_pierone: "橋脚1",
    COLORED_HOUSES: "{{count}}つの{{color}}家",
    COLORED_HOUSES_plural: "{{count}}つの{{color}}家",
    COMPLEX_HOUSES_AND_HOTELS:
      '彼らは6つの$t(COLORED_HOUSES, {"count": {{houses}}, "color": "{{color}}"})と$t(HOTELS, {"count": {{hotels}} })を持っています',
    COMPOUND: "$t(BRAND)の$t(BASICS.{{unit}})",
    CTA: "{{cta, uppercase}}することを忘れないでください",
    DOWNLOADS: {
      GENERATE_BUTTON: "レポートを生成する"
    },
    FULL_NAME: "私の名前は{{name.first}} {{name.last}}です",
    GENERATE_BUTTON: "$t(BRAND)のレポートを生成する",
    HOUSES_AND_HOTELS:
      '彼らは6つの$t(HOUSES, {"count": {{houses}}})と$t(HOTELS, {"count": {{hotels}} })を持っています',
    HOTELS: "{{count}}つのホテル",
    HOTELS_plural: "{{count}}つのホテル",
    HOUSES: "{{count}}つの家",
    HOUSES_plura: "{{count}}つの家",
    NAME: "私の名前は{{name}}です",
    REPORTS_LOADING_TEXT: "{{count}}つのレポートが生成されています...",
    REPORTS_LOADING_TEXT_plural: "{{count}}つのレポートが生成されています...",
    VAGUE_REPORTS_LOADING_TEXT: "レポートが生成されています...",
    VAGUE_REPORTS_LOADING_TEXT_plural: "いくつかのレポートが生成されています..."
  }
};

/* eslint-disable no-console */
/* eslint-disable no-undef */
const t = new T({
  appName: "test",
  fetchTranslations: ({ lang }) => translations[lang],
  lang: "en",
  onLanguageChange: (lang) => console.warn(lang)
});

// "en"

t("DOWNLOADS.GENERATE_BUTTON");

// "Generate report"

t.setLanguage("jp");

// "jp"

t("DOWNLOADS.GENERATE_BUTTON");

// "レポートを生成する"
