const path = require("path");

module.exports = {
  i18n: {
    locales: ["en", "nl"],
    defaultLocale: "nl",
    localePath: path.resolve("./public/locales"),
  },
};
