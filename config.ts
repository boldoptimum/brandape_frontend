type Environment = 'test' | 'development' | 'production';

// Easily switch environments by changing this value
const CURRENT_ENV: Environment = 'test';

const ENV_CONFIG = {
    test: {
        // Test environment uses local file, no API_URL needed.
        API_URL: '', 
    },
    development: {
        API_URL: 'http://localhost:3001',
    },
    production: {
        API_URL: 'https://api.brandape.com', // Placeholder URL
    },
};

export const config = {
    ENV: CURRENT_ENV,
    API_URL: ENV_CONFIG[CURRENT_ENV].API_URL,
    IS_TEST_ENV: CURRENT_ENV === 'test',
};
