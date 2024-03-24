import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
console.log('mounting')
  const { i18n } = useTranslation();

    // @ts-ignore
  const changeLanguage = (event) => {
    console.log('changing language')
    i18n.changeLanguage(event.target.value);
  };

  console.log(`chainging language to ${i18n.language}`)

  return (
    <select className="mr-4" onChange={changeLanguage} defaultValue={i18n.language}>
      <option value="en">English</option>
      <option value="de">Deutsch</option>
      <option value="es">Spanish</option>
      <option value="cn">Mandarin</option>
      {/* Add more options for other languages you support */}
    </select>
  );
}

export default LanguageSwitcher;
