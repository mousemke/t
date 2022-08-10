import type {
  AppName,
  Formatter,
  Lang,
  OnLanguageChange,
  Translate,
  TranslationConstructor,
  TranslationContructorProps,
  TranslateFunction,
  TranslationObject,
  TranslationOptions,
  Translator
} from "./t.types";

const variableRegex = /(?:{{(.+?)}})/g;
const recursiveRegex = /(?:\$t\((.+?)\))/g;

const T = function T(props: TranslationContructorProps): Translator {
  const { appName, lang, onLanguageChange, formatter, fetchTranslations } =
    props;

  /** .
   * Main translation function. Also defers to test when applicable.
   *
   * @param rawKey string
   * @param rawOptions TranslationOptions | string
   * @returns string
   */
  const translate: TranslateFunction = (rawKey, rawOptions = {}) => {
    let options = rawOptions;

    if (typeof rawOptions === "string") {
      options = { defaultValue: rawOptions };
    }

    const { count, context, defaultValue, plural } =
      options as TranslationOptions;

    let key = rawKey;
    key = context ? `${key}_${context}` : key;
    key =
      plural || (typeof count === "number" && count > 1)
        ? `${key}_plural`
        : key;

    let translation = key
      .split(".")
      .reduce(
        (tr, k) => tr?.[k] || defaultValue,
        this.translations as TranslationObject
      );

    if (this.testEnabled && !translation) {
      throw new Error(
        `[ERR] translation ${key} is missing in ${this.lang} ${this.appName}`
      );
    }

    // this is separated so test mode has a chance to throw an error
    translation = (translation || key) as string;

    /**
     * this grabs variable calls from inside the strings and replaces
     * them with the variable value. if no match is found, the variable is
     * not replaced
     *
     * in test mode a missing variable throws an error. outside test it will
     * return thge defaultValue on error (if available), or the key
     */
    let variableError = false;
    (translation.match(variableRegex) || []).forEach((match) => {
      const [variableString, format] = match.slice(2, -2).split(", ");

      const variable = variableString
        .split(".")
        .reduce((opt: TranslationOptions, v: string) => opt[v], options);

      if (variable) {
        translation = (translation as string).replace(
          match,
          this.formatter(variable, format)
        );
      } else if (this.testEnabled) {
        throw new Error(
          `[ERR] translation ${key} is missing variable ${variableString}`
        );
      } else {
        variableError = true;
      }
    });
    if (variableError) {
      return defaultValue || key;
    }

    (translation.match(recursiveRegex) || []).forEach((match) => {
      const args = match.slice(3, -1).split(", ");
      const opt = args[1] ? JSON.parse(args.slice(1).join(", ")) : undefined;

      const translationKey = translate(args[0], opt);
      translation = (translation as string).replace(match, translationKey);
    });

    return translation;
  };

  /**
   * Gets the current language.
   */
  this.getLanguage = () => {
    return this.lang;
  };

  /**
   * Gets the full translations object. Only works when test mode is enabled
   * It is intended for testing as well as generating types.
   */
  this.getTranslations = () => {
    if (this.testEnabled) {
      return this.translations;
    }

    console.error("[ERR] getTranslations only works when test mode is enabled");

    return null;
  };

  /** .
   * Handles setup of the variables and the retrieves initial translations
   *
   * @param appName string
   * @param lang string
   * @param onLanguageChange (lang) => void
   * @param formatter
   */
  this.init = (
    app: AppName,
    language: Lang,
    formatterFunction: Formatter,
    onLanguageChangeFunction?: OnLanguageChange
  ) => {
    this.appName = app;
    this.lang = language;
    this.formatter = formatterFunction;
    this.onLanguageChange = onLanguageChangeFunction;

    return this.setTranslations(lang);
  };

  /** .
   * Sets the language internally, grabs the translations,
   * then fires the onLanguageChange
   *
   * @param lang
   */
  this.setLanguage = (newLanguage: Lang): Promise<TranslationObject> => {
    this.lang = newLanguage;

    return this.setTranslations(newLanguage);
  };

  /** .
   * Enables or disables test mode
   *
   * @param test boolean
   */
  this.setTest = (test = true) => {
    this.testEnabled = test;
  };

  /** .
   * Grabs the translations from s3
   *
   * @param lang
   * @returns Promise<translations>
   */
  this.setTranslations = (newLanguage: string): Promise<TranslationObject> => {
    const setTranslation = (translations: TranslationObject) => {
      this.translations = translations;
    };

    return new Promise<TranslationObject>((resolve) => {
      resolve(
        fetchTranslations({
          appName,
          lang: newLanguage
        })
      );
    })
      .then((res: TranslationObject) => setTranslation(res))
      .then(() => this.onLanguageChange?.(newLanguage));
  };

  this.init(appName, lang, formatter, onLanguageChange);

  return Object.assign(translate, {
    getLanguage: this.getLanguage,
    getTranslations: this.getTranslations,
    setLanguage: this.setLanguage,
    setTest: this.setTest
  } as Translate);
} as TranslationConstructor<Translator>;

export default T;
