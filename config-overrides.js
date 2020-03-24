module.exports = function override(config, env) {
    config.externals = {
        react: 'React',
        'react-dom': 'ReactDOM',
        'react-router-dom': 'ReactRouterDOM',
        i18next: 'i18next',
        'react-i18next': 'ReactI18next',
        'i18next-xhr-backend': 'i18nextXHRBackend',
        'i18next-browser-languagedetector': 'i18nextBrowserLanguageDetector',
        '@material-ui/core': 'MaterialUI',
    };
    return config;
};
