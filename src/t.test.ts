import Translationary, { Translator } from ".";
import exampleTranslations from "./example-app.en.json";

let t: Translator;

const exampleProps = {
  appName: "example-app",
  fetchTranslations: () => exampleTranslations,
  formatter: (value, format) => {
    if (format === "uppercase") {
      return value.toUpperCase();
    }

    return value;
  },
  lang: "en"
};

describe("t", () => {
  beforeAll((done) => {
    t = new Translationary({
      ...exampleProps,
      onLanguageChange: () => done()
    });

    t.setTest();
  });

  describe("t", () => {
    it("should not crash if used before translations are retrieved", () => {
      const emptyT = new Translationary({
        ...exampleProps,
        fetchTranslations: () => ({})
      });

      expect(() => emptyT("DOWNLOADS.GENERATE_BUTTON")).not.toThrow();
    });

    it("should process a normal key - t('BRAND')", () => {
      expect(t("BRAND")).toBe("Brand X");
    });

    it("should process a nested object key - t('DOWNLOADS.GENERATE_BUTTON')", () => {
      expect(t("DOWNLOADS.GENERATE_BUTTON")).toBe("Generate report");
    });

    describe("Nested object failures in normal mode", () => {
      beforeAll(() => t.setTest(false));

      it("should return a supplied default if the nested object path is wrong - t('DOWNLOADS.OTHER_BUTTON', { defaultValue: 'Generate moon' })", () => {
        expect(
          t("DOWNLOADS.OTHER_BUTTON", { defaultValue: "Generate moon" })
        ).toBe("Generate moon");
      });

      it("should return the translation key if the nested object path is wrong and no default is provided - t('DOWNLOADS.OTHER_BUTTON')", () => {
        expect(t("DOWNLOADS.OTHER_BUTTON")).toBe("DOWNLOADS.OTHER_BUTTON");
      });

      afterAll(() => t.setTest());
    });

    describe("Nested object failures in test mode", () => {
      beforeAll(() => t.setTest());

      it("should return a supplied default if the nested object path is wrong - t('DOWNLOADS.OTHER_BUTTON', { defaultValue: 'Generate moon' })", () => {
        expect(
          t("DOWNLOADS.OTHER_BUTTON", { defaultValue: "Generate moon" })
        ).toBe("Generate moon");
      });

      it("should throw an error if the nested object path is wrong and no default is provided - t('DOWNLOADS.OTHER_BUTTON'))", () => {
        expect(() => t("DOWNLOADS.OTHER_BUTTON")).toThrowError(
          "[ERR] translation DOWNLOADS.OTHER_BUTTON is missing in en example-app"
        );
      });
    });

    it("should process a key with inline formatting -  t('CTA', { cta: 'click' })", () => {
      expect(t("CTA", { cta: "click" })).toBe("Dont forget to CLICK");
    });

    it("should process a key with detected dafault value - t('HOME_BRAND', 'the zoo')", () => {
      expect(t("HOME_BRAND", "the zoo")).toBe("the zoo");
    });

    it("should process a key with specified dafault value - t('HOME_BRAND', { defaultValue: 'the zoo' })", () => {
      expect(t("HOME_BRAND", { defaultValue: "the zoo" })).toBe("the zoo");
    });

    it("should process a key with context - t('BRAND', { context: 'pierone' })", () => {
      expect(t("BRAND", { context: "pierone" })).toBe("Pier One");
    });

    it("should process a key with a variable - t('NAME', { name: 'Bob' })", () => {
      expect(t("NAME", { name: "Bob" })).toBe("My name is Bob");
    });

    it("should process a key with variable in a nested object - t('FULL_NAME', { name: { first: 'Bob', last: 'Barker' } })", () => {
      expect(t("FULL_NAME", { name: { first: "Bob", last: "Barker" } })).toBe(
        "My name is Bob Barker"
      );
    });

    it("should process a key with nested variables - t('HOUSES_AND_HOTELS', { houses: 3, hotels: 2 })", () => {
      expect(t("HOUSES_AND_HOTELS", { houses: 3, hotels: 2 })).toBe(
        "They have 3 houses and 2 hotels"
      );
    });

    it("should process a key with nested variables and multiple properties - t('COMPLEX_HOUSES_AND_HOTELS', { houses: 3, hotels: 2, color: 'red' })", () => {
      expect(
        t("COMPLEX_HOUSES_AND_HOTELS", { houses: 3, hotels: 2, color: "red" })
      ).toBe("They have 3 red houses and 2 hotels");
    });

    it("should process a key with variable of another translation - t('GENERATE_BUTTON')", () => {
      expect(t("GENERATE_BUTTON")).toBe("Generate report for Brand X");
    });

    describe("variable failures in normal mode", () => {
      beforeAll(() => t.setTest(false));

      it("should return a supplied default value if the variable is falsey - t('NAME', { defaultValue: 'Hello' })", () => {
        expect(t("NAME", { defaultValue: "Hello" })).toBe("Hello");
      });

      it("should return the key if no supplied default value if the variable is falsey - t('NAME', { name: null })", () => {
        expect(t("NAME", { name: null })).toBe("NAME");
      });

      afterAll(() => t.setTest());
    });

    describe("variable failures in test mode", () => {
      beforeAll(() => t.setTest());

      it("should throw an error if the variable is falsey - t('NAME', { defaultValue: 'Hello' })", () => {
        expect(() => t("NAME")).toThrowError(
          "[ERR] translation NAME is missing variable name"
        );
      });

      it("should throw an error if no supplied default value if the variable is falsey - t('NAME', { name: null })", () => {
        expect(() => t("NAME", { name: null })).toThrowError(
          "[ERR] translation NAME is missing variable name"
        );
      });
    });

    it("should process a key with singlular count - t('REPORTS_LOADING_TEXT', { count: 1 })", () => {
      expect(t("REPORTS_LOADING_TEXT", { count: 1 })).toBe(
        "1 report is being generated..."
      );
    });

    it("should process a key with automatic plural state - t('REPORTS_LOADING_TEXT', { count: 4 })", () => {
      expect(t("REPORTS_LOADING_TEXT", { count: 4 })).toBe(
        "4 reports are being generated..."
      );
    });

    it("should process a key with manual plural state - t('VAGUE_REPORTS_LOADING_TEXT', { plural: true })", () => {
      expect(t("VAGUE_REPORTS_LOADING_TEXT", { plural: true })).toBe(
        "Some reports are being generated..."
      );
    });

    it("should process a compound combinations of variables and recursive translations - t('COMPOUND', { unit: 'PARTNER_MODEL' })", () => {
      expect(t("COMPOUND", { unit: "PARTNER_MODEL" })).toBe(
        "Article from Brand X"
      );
    });
  });

  describe("t.getLanguage", () => {
    it("should return the current language", () => {
      expect(t.getLanguage()).toBe("en");
    });
  });

  describe("t.setLanguage", () => {
    it("should change the internal language and retrieve new translations", (done) => {
      const fetchTranslationsSpy = jest.fn();

      const changingT = new Translationary({
        ...exampleProps,
        fetchTranslations: fetchTranslationsSpy
      });

      changingT.setLanguage("fr").then(() => {
        expect(changingT.getLanguage()).toBe("fr");
        expect(fetchTranslationsSpy).toBeCalledTimes(2);

        done();
      });
    });
  });

  describe("t.getTranslations", () => {
    it("should fire a console.error if fired outside of test mode", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => null);

      t.setTest(false);
      expect(t.getTranslations()).toBe(null);

      expect(consoleSpy.mock.calls[0][0]);
    });

    it("should return the current translations object", () => {
      t.setTest();

      expect(t.getTranslations()).toBe(exampleTranslations);
    });
  });

  describe("t.setTest", () => {
    it("should return the translation key while unknown and test mode is off ", () => {
      t.setTest(false);

      expect(t("MOON")).toBe("MOON");
    });

    it("should throw an error while unknown and test mode is on ", () => {
      t.setTest();

      expect(() => t("MOON")).toThrowError(
        `[ERR] translation MOON is missing in en example-app`
      );
    });
  });

  afterAll(() => {
    t.setTest(false);
  });
});
