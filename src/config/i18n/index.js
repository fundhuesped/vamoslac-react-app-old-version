import I18n from "react-native-i18n";
import en from "./locales/en";
import es from "./locales/es";

I18n.fallbacks = true;

I18n.translations = {
  en,
  es
};

export default I18n;

// import store from '../../store/index.js'
// import {setLang} from '../../constants/actions/index.js'

// store.dispatch(setLang(I18n.currentLocale()))
// store.dispatch(setLang(store.getState().ui.lang))

// Set your locale is easy as
// I18n.defaultLocale = 'en-US'
// I18n.locale = 'en-US'
