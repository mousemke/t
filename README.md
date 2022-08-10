# translationary

A utility to parse strings and retrieve translations

<a href="#installation">Installation</a>

<a href="#initialization">Initialization</a>

<a href="#usage">Usage</a>

<a href="#example-translations">Example Translations</a>

## Installation

To install, use npm. For the procuction code, there are no dependencies.

```bash
npm install translationary
```

## Initialization

To add it to your project, first import the default T. `.js`, `.cjs`, and `.mjs` files are available. If you are using Typescript, you may want to import any of the types, available from the same place.

```ts
import T from "translationary";
import T, { Formatter } from "translationary"; // example with typescript
```

To initialize the parser, you must create a new instance with the following properties:

```ts
new T({
  /**
   * The name of the app. This is used internally as well as passed to the fetchTranslations function for context.
   */
  appName, // string

  /**
   * This is the function that does the actual fetching of the translations. Whether remotely or from a local source, this is abstracted to provide flexibility to grab from wherever you need to.
   */
  fetchTranslations, // ({ appName: string; lang: string }) => TranslationObject;

  /**
   * The formatter is used when variables are passed format strings (see below in Usage). It is fed a value string and a format string and it is up to the formatter to make the appropriate mutations.
   */
  formatter, // (value: string, format: string) => string;

  /**
   * The initial language to retrieve. This is used internally as well as passed to the fetchTranslations function for context.
   */
  lang, // string

  /**
   * This is the function that is fired once new translations are retrieved. It is up to the devs on how to use this, but depending on your setup it may be an event firing or a react setState.
   */
  onLanguageChange // (lang: string) => void
});
```

## Usage

### t

The main translation function accepts a key string and an optional options object. The key will retrieve a translation string from the translations object. The key can be a deeper object address as well.

```ts
const translations = {
  HELLO: "Hello!",
  OTHER_GREETINGS: {
    MOIN: "Moin Moin!"
  }
};

t("HELLO");
// Hello!

t("OTHER_GREETINGS.MOIN");
// "Moin Moin!"
```

There are also dynamic things that can be added and parsed from the translation string once retrieved.

#### Variables

Variables are formatted by being wrapped in double curly brackets. The variable name is extracted and the value is then taken from the options object.

```ts
const translations = {
  HOME: "{{color}} house"
};

t("HOME", {color: "blue"});
// blue house
```


#### Variable formatting

Variables can also use formatting. It is set as a second parameter to the variable, then both strings are sent into the formatter supplied in the initialization. Formatting options are only limited by your imagination - as long as your imagination only uses strings.

```ts
const t = new T({
  appName,
  fetchTranslations,
  lang,
  onLanguageChange
  formatter: (value, fomat) => {
    if (format === "uppercase") {
      returm value.toUpperCase();
    }

    return value;
  };
});

const translations = {
  HOME: "{{color, uppercase}} house"
};

t("HOME", {color: "blue"});
// BLUE house
```

#### Count and Plurals

Count is a special variable. It is treated the same inline as the other variables with an additional exception. If the count is more than 1, it will automatically make the translation plural. Plural translations are set by using the same key with the addition of `_plural` to it.

```ts
const translations = {
  HOME: "{{count}} house",
  HOME_plural: "{{count}} houses",
  VAUGE_HOME: "a house",
  VAUGE_HOME_plural: "some houses"
};

t("HOME", {count: 1});
// 1 house

t("HOME", {count: 4});
// 4 houses
```

Plurals can also be set manually

```ts
t("VAGUE_HOME");
// a house

t("VAGUE_HOME", { plural: true});
// some houses
```

#### Default values

Default values can be set in case a key is not found. This value is also the fallback if a variable in the translation is not found. Default value can be set by the `defaultValue` property, or by simply passing a string as the second paramenter

```ts
const translations = {
  GREETING: "Good morning, {{name}}"
};

t("COMPLEX_GREETING", "Moin!");
// "Moin!"

t("COMPLEX_GREETING", { defaultValue: "Moin!" });
// "Moin!"

const name = undefined; // a failed api call, an unexpected retrieval failure, etc
t("GREETING", { defaultValue: "Moin!", name });
// "Moin!"
```

#### Context

Context is similar to plurals in usage, however the target can be specified.

```ts
const translations = {
  GREETING_open: "Come in we're open!",
  GREETING_closed: "Sorry, we're closed.",
};

const time = new Date().getHours();

if (time > 9 && time < 22) {
  t("GREETING", { context: "open"});
  // Come in we're open!
} else {
  t("GREETING", { context: "closed"});
  // Sorry, we're closed.
}
```

#### Recursion

Translation strings can also contain other translations. These translations are allowed to have all the complexity of a normal translation. In order to use an inline translation you must add a `$` prefix to the normal `t` function call. Inline you also omit quotion marks fron the key, however not from the options object, as it is parsed as JSON

```ts
const translations = {
  HOME: "I live in $(HOME, { \"context\": location })",
  HOME_location: "Berlin",
  WORK: "I work at $(WORK, { \"context\": location })",
  WORK_location: "the zoo",
  STORY: "$t(HOME) and $(WORK)"
};

t("HOME");
// I live in Berlin

t("WORK");
// I work at the zoo

t("STORY");
// I live in Berlin and I work at the zoo
```

#### Other uses

Though most use cases are covered above, see [the example translations for more complex uses](#example-translations).

### t.getLanguage

This returns the current active language string.

```ts
t.getLanguage();
// en
```

### t.setLanguage

This sets a new language string. It sets the language internally, fires `fetchTranslations` with the new language string, sets the returned translations as the active translations, then fires the supplied `onLanguageChange` function to notify that it is ready.

```ts
t.setLanguage("fr)
```

### t.setTest

Enables test mode. This mode will throw errors instead of failing gracefully. It is intended for pre deploy or in a CI/CD pipeline to fail a deploy if the required translations do not exist. It accepts a boolean but is `true` by default.

```ts
t.setTest()
// test mode activated

t.setTest(false)
// test mode de-activated
```

### t.getTranslations

Returns the entire translations object. As this is not intended for production, it only works in test mode. However there are many valid use cases where someone may need the translations object during a build (generating types, etc).

```ts
t.getTranslations()
// TranslationsObject
```

## Example Translations

```ts
const tranlations = {
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
}
```

### Normal key

```ts
t("BRAND")  // "Brand X"
```

### Nested object key

```ts
t("DOWNLOADS.GENERATE_BUTTON")  // "Generate report"
```

### Key with inline formatting

```ts
t("CTA", { cta: "click" })  // "Dont forget to CLICK"
```

### Key with detected dafault value

```ts
t("HOME_BRAND", "the zoo")  // "the zoo"
```

### Key with specified dafault value

```ts
t("HOME_BRAND", { defaultValue: "the zoo" })  // "the zoo"
```

### Key with context

```ts
t("BRAND", { context: "pierone" })  // "Pier One"
```

### Key with a variable

```ts
t("NAME", { name: "Bob" })  // "My name is Bob"
```

### Key with variable in a nested object

```ts
t("NAME", { name: { first: "Bob", last: "Barker" } })  // "My name is Bob Barker"
```

### Key with nested variables

```ts
t("HOUSES_AND_HOTELS", {houses: 3, hotels: 2});  // "They have 3 houses and 2 hotels"
```

### Key with nested variables and multiple properties

```ts
t("COMPLEX_HOUSES_AND_HOTELS", {houses: 3, hotels: 2, color: "red"});  // "They have 3 houses and 2 hotels"
```

### Key with variable of another translation

```ts
t("GENERATE_BUTTON")  // "Generate report for Brand X"
```

### Key with singlular count

```ts
t("REPORTS_LOADING_TEXT", { count: 1 })  // "1 report is being generated..."
```

### Key with automatic plural state

```ts
t("REPORTS_LOADING_TEXT", { count: 4 })  // "4 reports are being generated..."
```

### Key with manual plural state

```ts
t("VAGUE_REPORTS_LOADING_TEXT", { plural: true })  // "Some reports are being generated..."
```

### Compound combinations of variables and recursive translations

```ts
t("COMPOUND", { unit: "PARTNER_MODEL" })  // "Article from Brand X"
```
