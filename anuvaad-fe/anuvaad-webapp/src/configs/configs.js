const configs = {
    BASE_URL: 'http://52.40.71.62:5000',
    BASE_URL_AUTO: process.env.REACT_APP_APIGW_BASE_URL ? process.env.REACT_APP_APIGW_BASE_URL : 'https://auth.anuvaad.org',
    BASE_URL_NMT: 'http://52.40.71.62:3000',
    DASBOARD_URL: process.env.REACT_APP_DASHBOARD_URL ? process.env.REACT_APP_DASHBOARD_URL : 'https://dev-dashboard.anuvaad.org/api',
    DEV_SALT: process.env.SALT ? process.env.SALT : '85U62e26b2aJ68dae8eQc188e0c8z8J9',
    DEV_PEPPER: 'a7cec3248a8c5a4d9737b1a2520b24c6'
};

export default configs;
