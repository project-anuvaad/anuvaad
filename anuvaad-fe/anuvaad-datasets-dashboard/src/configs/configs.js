const configs = {
    BASE_URL: 'http://52.40.71.62:5000',
    BASE_URL_AUTO: process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL : 'https://auth.anuvaad.org',
    BASE_URL_NMT: 'http://52.40.71.62:3000',
    DEV_SALT: '85d62e26b2aa68dae8ebc18860c8e899',
    DEV_PEPPER: 'a7cec3248a8c5a4d9737b1a2520b24c6'
};

export default configs;
