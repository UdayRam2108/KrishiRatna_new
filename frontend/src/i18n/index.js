import en from "./en.json";
import hi from "./hi.json";
import gu from "./gu.json";
import mr from "./mr.json";
import ta from "./ta.json";
import te from "./te.json";

const languages = {
  en,
  hi,
  gu,
  mr,
  ta,
  te
};

export const getTranslation = (lang, key) => {
  return languages[lang]?.[key] || key;
};
