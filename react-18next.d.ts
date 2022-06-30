import common from "./public/locales/nl/common.json";
import footer from "./public/locales/nl/footer.json";
import instruction from "./public/locales/nl/instruction.json";

import "react-i18next";

interface Languages {
  common: typeof common;
  footer: typeof footer;
  instruction: typeof instruction;
}

declare module "react-i18next" {
  interface Resources extends Languages {}
}
