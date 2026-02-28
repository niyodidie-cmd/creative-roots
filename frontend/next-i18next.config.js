const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
  },
  localePath: path.resolve('./public/locales'),
  ns: ['common', 'home', 'about', 'events', 'donations', 'contact', 'admin'],
  defaultNS: 'common',
};
