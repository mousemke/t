export type AppName = string;
export type Lang = string;
export type OnLanguageChange = (lang: string) => void;
export type Formatter = (value: string, format: string) => string;

/**
 * All the translations
 */
export interface TranslationObject {
  [key: string]: string | TranslationObject;
}

export interface TranslationOptions {
  /**
   * Used as a normal variable, however any count above 1 will automatically
   * set the plural version of a translation
   */
  count?: number;

  /**
   * Used to dynamically apply context to translation keys. This will add
   * the context to the key as it looks it up
   */
  context?: string;

  /**
   * Used in normal mode if a key is not found, if a nested object does not
   * exist, and if a variable is falsy
   */
  defaultValue?: string;

  /**
   * Similar to count over 1, tihs is a way to manually force plural usage
   */
  plural?: boolean;

  /**
   * any other value. used to pass variables into the translation strings
   */
  [key: string]: unknown;
}

export interface TranslateFunction {
  /**
   * The main translation function that the support methods are attached to
   */
  (key: string, options?: TranslationOptions | string): string;
}

export interface Translate {
  /**
   * The app name passed into the constructor. This is also passed into the
   * fetchTranslations function for comtext to retrieve the
   * correct translations
   */
  appName: AppName;

  /**
   * The formatter passed into the constructor. This recieves the second param
   * of variables to determine how the translatio should be mutated
   */
  formatter?: Formatter;

  /**
   * Gets the currently active language string
   */
  getLanguage: () => string;

  /**
   * Gets the currently active translations object. This only works while
   * testMode is active. It is not intended for direct access, however there
   * are use cases (such as generating types) that require the
   * translations object.
   */
  getTranslations: () => TranslationObject;

  /**
   * The lang passed into the constructor. This is also passed into the
   * fetchTranslations function for comtext to retrieve the
   * correct translations. This is also the only part that is dynamically
   * changeable outside the constructor
   */
  lang: Lang;

  /**
   * The app name passed into the constructor
   */
  onLanguageChange?: OnLanguageChange;

  /**
   * Translations recieved from fetchTranslations. This is the main
   * source of information
   */
  translations: TranslationObject;

  /**
   * Sets a new current language. Triggers fetchTranslations and fires the
   * supplied onLanguageChange when complete
   */
  setLanguage: (lang: Lang) => Promise<TranslationObject>;

  /**
   * Turns test mode on and off. In test mode variable failures, missing
   * translations, and nested translation objects all throw errors instead
   * of dealing with them gracefully. This mode is intended to be used on
   * a CI/CD pipeline and fail, preventing deploy of anything with issues
   */
  setTest: (test?: boolean) => string;
}

/**
 * the properties supplied to FetchTranslationFunction
 */
export type FetchTranslationFunctionProps = { appName: string; lang: string };

/**
 * The actual function that does the fetching of the translations. For
 * maximum flexibility this is abstracted out to the user.
 */
export type FetchTranslationFunction = (
  props: FetchTranslationFunctionProps
) => TranslationObject | Promise<TranslationObject>;

export interface TranslationContructorProps {
  /**
   * The app name passed into the constructor. This is also passed into the
   * fetchTranslations function for comtext to retrieve the
   * correct translations
   */
  appName: AppName;

  /**
   * The lang passed into the constructor. This is also passed into the
   * fetchTranslations function for comtext to retrieve the
   * correct translations. This is also the only part that is dynamically
   * changeable outside the constructor
   */
  lang: Lang;

  /**
   * The function fored after translations are successfully retrieved. This is
   * the traditional place to fire an event or state change that will trigger
   * test re-renders in your app
   */
  onLanguageChange?: OnLanguageChange;

  /**
   * The actual function that does the fetching of the translations. For
   * maximum flexibility this is abstracted out to the user.
   */
  fetchTranslations: FetchTranslationFunction;

  /**
   * The formatter passed into the constructor. This recieves the second param
   * of variables to determine how the translatio should be mutated
   */
  formatter?: Formatter;
}

/**
 * The main `T` constructor. This should always be used with "new".
 * It will not work without new.
 *
 */
/* eslint-disable no-shadow */
// we disable a lint rule since we need to declare the same name in this example
export interface TranslationConstructor<T> {
  (TranslationContructorProps): T;
  new (TranslationContructorProps): T;
}
/* eslint-enable */

/**
 * The return of the constructor. The main translation function with the support methods attached to it.
 */
export type Translator = TranslateFunction & Translate;
