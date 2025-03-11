export const isProductionEnvironment = process.env.NODE_ENV === 'production';

export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
    process.env.PLAYWRIGHT ||
    process.env.CI_PLAYWRIGHT,
);

// Default model selection
export const DEFAULT_MODEL = 'gpt-4o';

// List of available models
export const MODELS = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    vendor: 'openai',
    description: 'Most capable model for complex tasks',
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    vendor: 'openai',
    description: 'Fast and efficient for everyday tasks',
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    vendor: 'anthropic',
    description: 'Anthropic\'s most powerful model',
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    vendor: 'anthropic',
    description: 'Balanced performance and efficiency',
  }
];

// Environmental impact constants
export const ENV_IMPACT = {
  // Average token calculation ratios
  TOKEN_TO_CO2: 0.02, // grams of CO2 per token
  TOKEN_TO_WATER: 0.0001, // liters of water per token (0.1 ml)
  
  // Display thresholds
  HIGH_TOKEN_THRESHOLD: 1000, // tokens threshold for high usage warning
  
  // Display limits for visualization
  MAX_CO2_DISPLAY: 2000, // grams (for 100% fill in visualization)
  MAX_WATER_DISPLAY: 0.01 // liters (10ml) for 100% fill
};

// App configuration
export const APP_CONFIG = {
  MAX_ATTACHMENT_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FILE_TYPES: [
    'image/jpeg', 
    'image/png', 
    'image/webp',
    'text/plain', 
    'text/markdown',
    'application/pdf'
  ]
};

// Server artifacts configuration
export const ARTIFACT_TYPES = {
  TEXT: 'text',
  CODE: 'code',
  SHEET: 'sheet',
  IMAGE: 'image'
};
