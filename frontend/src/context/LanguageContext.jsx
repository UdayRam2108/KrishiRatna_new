import React, { createContext, useContext, useState, useEffect } from "react";
import { getTranslation } from "../i18n";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("hi"); // default Hindi

  useEffect(() => {
    const savedLang = localStorage.getItem("kr_lang");
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("kr_lang", lang);
  };

  const t = (key) => getTranslation(language, key);

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
