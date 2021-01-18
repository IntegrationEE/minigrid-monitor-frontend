import { environment } from '@env/environment';

export class AppConst {
  static MAIN_ROUTES = {
    ADMIN: 'admin',
    AUTH: 'auth',
    CHART_CONFIGURATIONS: 'chart-configurations',
    CONFIRM_EMAIL: 'confirm-email',
    CONFIRM_SIGN_UP: 'confirm-sign-up',
    DASHBOARD: 'dashboard',
    FORGOT_PASSWORD: 'forgot-password',
    INTEGRATIONS: 'integrations',
    LOG_OUT: 'log-out',
    SIGN_UP: 'sign-up',
    SITES: 'sites',
    PARAM: '/:param',
    PAGE_NOT_FOUND: 'page-not-found',
    PROGRAMME_INDICATORS: 'programme-indicators',
    RESET_PASSWORD: 'reset-password',
    COMPANY_USERS: 'company-users',
    USER_PROFILE: 'profile',
    WELCOME_PAGE: 'welcome-page',
  };

  static REQUESTS_URL = {
    ACCOUNTS: 'accounts',
    APPROVE: '/approve',
    ADVANCED_ANALYTICS: 'advancedanalytics',
    CHART_CONFIGURATIONS: 'ChartConfigurations',
    CONNECT_TOKEN: 'connect/token',
    CONSUMPTIONS: 'consumptions',
    COMPANIES: 'companies',
    CONFIRM_EMAIL: 'confirm',
    CONVENTIONAL_TECHNOLOGIES: 'conventional-technologies',
    CONVERTABLE_TYPES: 'convertable-types',
    CURRENT: '/current',
    CUSTOMER_SATISFACTIONS: 'CustomerSatisfactions',
    DETAILS: 'details',
    DOCUMENTS: 'documents',
    EMPLOYMENTS: 'Employments',
    ENUMS: 'enums',
    EXPORT: '/export',
    FILTERS: '/filters',
    FINANCIAL: 'financial',
    FINANCE_CAPEX: 'financeCapex',
    FINANCE_OPEX: 'financeOpex',
    FORGOT_PASSWORD: 'forgotPassword',
    GRAPH: '/graph',
    GRID_CONNECTIONS: 'grid-connections',
    HEAD_OF_COMPANY: 'headOfCompany',
    INTEGRATION_RECORDS: 'IntegrationRecords',
    INTEGRATIONS: 'integrations',
    LIST: '/list',
    LGA: 'localGovernmentAreas',
    MAP: '/map',
    METERING_TYPES: 'meteringTypes',
    NEW_SERVICES: 'NewServices',
    OVERVIEW: 'overview',
    PASSWORD: '/password',
    PEOPLE_CONNECTED: 'PeopleConnected',
    PROGRAMMES: 'programmes',
    PROGRAMME_INDICATORS: 'programmeindicators',
    PROGRAMME_INDICATOR_VALUES: 'programmeIndicatorValues',
    PUBLISHED: 'published',
    REGISTER: 'register',
    RENEWABLE_TECHNOLOGIES: 'renewable-technologies',
    RESEND_EMAIL: 'resendEmail',
    RESET_PASSWORD: 'resetPassword',
    RESTART: 'restart',
    REVENUES: 'revenues',
    ROLES: 'roles',
    SETTINGS: 'settings',
    SITES: 'sites',
    SITE_TECHNICAL_PARAMETERS: 'siteTechnicalParameters',
    SITE_QRS: 'SiteQrs',
    SOCIAL: 'social',
    STATES: 'states',
    STATUS: '/status',
    STORAGE_TECHNOLOGIES: 'storage-technologies',
    TARIFFS: 'Tariffs',
    TECHNICAL: 'technical',
    THRESHOLDS: 'Thresholds',
    TOGGLE: 'toggle',
    UPLOAD: 'upload',
    USERS: 'users',
    VALIDATE: 'validate',
  };

  static TOKEN = {
    KEY: 'access_token',
    EXPIRES: 'expires_in',
    TYPE: 'token_type',
    REFRESH: 'refresh_token',
  };

  static CHART_COLORS = {
    BLUE: '#0000ff',
    GREEN: '#1dd069',
    GREEN_LIGHT: '#1dd068',
    GREY: '#93939f',
    GREY_LIGHT: '#e0e2e9',
    GREY_DARK: '#464646',
    LIMONE: '#c6f3d9',
    YELLOW_DARK: '#ffbb00',
    ORANGE: '#f5492b',
    RED: '#b91109',
    WHITE: '#fff',
  };

  static COLOR_PALETTE = {
    GREY_LIGHT: '#eeeff1',
    WHITE: '#fff',
  };

  static FILTER_TYPES = {
    COMPANIES: 'companies',
    PROGRAMMES: 'programmes',
    STATES: 'states',
    TECHNOLOGIES: 'technologies',
    GRID_CONNECTIONS: 'grid-connections',
  };

  static MESSAGE_DURATION = {
    SUCCESS: 5000,
    INFO: 5000,
    ERROR: 10000,
  };

  static MESSAGE_BUTTON = {
    OK: 'OK',
    CONFIRM: 'Confirm',
    CLOSE: 'Close',
  };

  static AUTH = {
    scope: 'api.full_access offline_access',
    client_id: 'AngularApp',
    grant_type: 'password',
    grant_type_refresh: 'refresh_token',
    grant_type_custom: 'custom',
  };

  static MODAL_SIZES = {
    ULTRA_LARGE: '1200px',
    VERY_BIG: '900px',
    BIG: '800px',
    MEDIUM: '600px',
    SMALL: '400px',
  };

  static REG_EXP = {
    PHONE_PREFIX: /[+][1-9][0-9]{2}$|[+][1-9][0-9]$/,
    PHONE_NUMBER: /[1-9][0-9]{2}[ ][0-9]{3}[ ][0-9]{4}$|[1-9][0-9]{9}$/,
    MIN_MAX_THRESHLODS: /^\d{1,4}(\.\d{1,4})?$/,
    ONLY_LETTERS: /^[a-zA-Z\s]*$/,
    ONLY_NUMBERS: /^\d+$/,
    DECIMAL_NUMBERS: /^\d+(\.\d{1,2})?$/,
    NO_WHITE_SPACE: /^\S+$/,
  };

  static ICONS = {
    admin: `${environment.iconUrl}admin.png`,
    arrowDown: `${environment.iconUrl}arrowRedDown.png`,
    arrowRight: `${environment.iconUrl}arrowYellowRight.png`,
    arrowUp: `${environment.iconUrl}arrowGreenUp.png`,
    biomass: `${environment.iconUrl}biomass.png`,
    battery2: `${environment.iconUrl}battery2.png`,
    checkmark: `${environment.iconUrl}checkmark.png`,
    chevron: `${environment.iconUrl}arrowDown.png`,
    circleCheck: `${environment.iconUrl}circleCheck.png`,
    companyUsers: `${environment.iconUrl}requestedAccounts.png`,
    dollar: `${environment.iconUrl}dollar.png`,
    dollarGreen: `${environment.iconUrl}dollarGreen.png`,
    download: `${environment.iconUrl}download.png`,
    downloadGreen: `${environment.iconUrl}downloadGreen.png`,
    edit: `${environment.iconUrl}edit.png`,
    editGreen: `${environment.iconUrl}editGreen.png`,
    gear: `${environment.iconUrl}gear.png`,
    hydro: `${environment.iconUrl}hydro.png`,
    info: `${environment.iconUrl}info.png`,
    location: `${environment.iconUrl}locationBlack.png`,
    locationGreen: `${environment.iconUrl}locationGreen.png`,
    logo: `${environment.iconUrl}logo.png`,
    logout: `${environment.iconUrl}door.png`,
    magnifier: `${environment.iconUrl}magnifier.png`,
    map: `${environment.iconUrl}mapBlack.png`,
    mapGreen: `${environment.iconUrl}mapGreen.png`,
    marker: `${environment.iconUrl}marker.png`,
    markerGreen: `${environment.iconUrl}markerSelected.png`,
    offGrid: `${environment.iconUrl}pole.png`,
    programmesIndicators: `${environment.iconUrl}programmesIndicators.png`,
    ribbon: `${environment.iconUrl}ribbon.png`,
    save: `${environment.iconUrl}save.png`,
    stack: `${environment.iconUrl}stackBlack.png`,
    stackGreen: `${environment.iconUrl}stackGreen.png`,
    stack3D: `${environment.iconUrl}stack3DBlack.png`,
    stack3DGreen: `${environment.iconUrl}stack3DGreen.png`,
    social: `${environment.iconUrl}peopleBlack.png`,
    socialGreen: `${environment.iconUrl}peopleGreen.png`,
    sun: `${environment.iconUrl}sun.png`,
    technical: `${environment.iconUrl}battery.png`,
    technicalGreen: `${environment.iconUrl}batteryGreen.png`,
    trash: `${environment.iconUrl}trash.png`,
    wind: `${environment.iconUrl}wind.png`,

    graphBiodiesel: `${environment.iconUrl}graphBiodiesel.png`,
    graphBiomass: `${environment.iconUrl}graphBiomass.png`,
    graphHydro: `${environment.iconUrl}graphHydro.png`,
    graphWind: `${environment.iconUrl}graphWind.png`,
    graphPublic: `${environment.iconUrl}graphPublic.png`,
    graphBattery: `${environment.iconUrl}graphBattery.png`,
    graphCommercial: `${environment.iconUrl}graphCommercial.png`,
    graphDiesel: `${environment.iconUrl}graphDiesel.png`,
    graphInverter: `${environment.iconUrl}graphInverter.png`,
    graphOffGrid: `${environment.iconUrl}graphOffGrid.png`,
    graphOnGrid: `${environment.iconUrl}graphOnGrid.png`,
    graphProductive: `${environment.iconUrl}graphProductive.png`,
    graphPV: `${environment.iconUrl}graphPV.png`,
    graphResidential: `${environment.iconUrl}graphResidential.png`,
  };

  static CONTENT_TYPES = {
    CSV: 'text/csv',
    XLS: 'application/vnd.ms-excel',
    IMAGE_PNG: 'image/png',
  };

  static EXTENSIONS = {
    CSV: '.csv',
    XLS: '.xls',
    PNG: '.png',
  };

  static GENERAL = {
    NOT_APPLICABLE: 'N/A',
  };
}
