
import { AppConst } from 'app/app.const';

import { SocialIndicatorType } from './social-indicators.enum';

export class SocialIndicatorsConst {
  static TOPICS = [
    {
      name: 'Connections',
      url: AppConst.REQUESTS_URL.PEOPLE_CONNECTED,
      type: SocialIndicatorType.CONNECTIONS,
    },
    {
      name: 'Customer satisfactions',
      url: AppConst.REQUESTS_URL.CUSTOMER_SATISFACTIONS,
      type: SocialIndicatorType.CUSTOMER_SATISFACTIONS,
    },
    {
      name: 'Employments',
      url: AppConst.REQUESTS_URL.EMPLOYMENTS,
      type: SocialIndicatorType.EMPLOYMENTS,
    },
    {
      name: 'Services',
      url: AppConst.REQUESTS_URL.NEW_SERVICES,
      type: SocialIndicatorType.SERVICES,
    },
    {
      name: 'Tariffs',
      url: AppConst.REQUESTS_URL.TARIFFS,
      type: SocialIndicatorType.TARIFF,
    },
  ];

  static CONTROLS = {
    RESIDENTIAL_CONNECTIONS: 'residential',
    COMMERCIAL_CONNECTIONS: 'commercial',
    PRODUCTIVE_CONNECTIONS: 'productive',
    PUBLIC_CONNECTIONS: 'public',

    DIRECT_EMPLOYMENT: 'direct',
    INDIRECT_EMPLOYMENT: 'indirect',

    VERY_SATISFIED: 'verySatisfied',
    SOMEHOW_SATISFIED: 'somehowSatisfied',
    VERY_UNSATISFIED: 'veryUnsatisfied',
    SOMEHOW_UNSATISFIED: 'somehowUnsatisfied',
    NEITHER_SATISFIED_NOR_UNSATISFIED: 'neitherSatisfiedNorUnsatisfied',

    COMMERCIAL_SERVICES: 'commercial',
    PRODUCTIVE_SERVICES: 'productive',
    HEALTH_SERVICES: 'health',
    EDUCATION_SERVICES: 'education',

    RESIDENTIAL_TARFIFF: 'residential',
    COMMERCIAL_TARFIFF: 'commercial',
    PRODUCTIVE_TARFIFF: 'productive',
    PUBLIC_TARFIFF: 'public',
  };

  static LABELS = {
    RESIDENTIAL_CONNECTIONS: 'Residential connections',
    COMMERCIAL_CONNECTIONS: 'Commercial connections',
    PRODUCTIVE_CONNECTIONS: 'Productive connections',
    PUBLIC_CONNECTIONS: 'Public connections',

    DIRECT_EMPLOYMENT: 'Direct employment',
    INDIRECT_EMPLOYMENT: 'Indirect employment',

    VERY_SATISFIED: 'Very satisfied',
    SOMEHOW_SATISFIED: 'Somehow satisfied',
    VERY_UNSATISFIED: 'Very unsatisfied',
    SOMEHOW_UNSATISFIED: 'Somehow unsatisfied',
    NEITHER_SATISFIED_NOR_UNSATISFIED: 'Neither satisfied nor unsatisfied',

    COMMERCIAL_SERVICES: 'Commercial services',
    PRODUCTIVE_SERVICES: 'Productive services',
    HEALTH_SERVICES: 'Health services',
    EDUCATION_SERVICES: 'Education services',

    RESIDENTIAL_TARFIFF: 'Residential tariff',
    COMMERCIAL_TARFIFF: 'Commercial tariff',
    PRODUCTIVE_TARFIFF: 'Productive tariff',
    PUBLIC_TARFIFF: 'Public tariff',
  };

  static TOOLTIPS = {
    RESIDENTIAL_CONNECTIONS: 'Insert the number of household connections',
    COMMERCIAL_CONNECTIONS: 'Insert the number of commercial connections',
    PRODUCTIVE_CONNECTIONS: 'Insert the number of connected productive users',
    PUBLIC_CONNECTIONS: 'Insert the number of public facilities connected',

    DIRECT_EMPLOYMENT: 'Insert the number of direct employment opportunities created by the mini-grid developer',
    INDIRECT_EMPLOYMENT: 'Insert the number of employment opportunities indirectly created by the mini-grid, e.g. by new commercial services',

    VERY_SATISFIED: 'Please type the number of very satisified customers',
    SOMEHOW_SATISFIED: 'Please type the number of somehow satisified customers',
    VERY_UNSATISFIED: 'Please type the number of very unsatisified customers',
    SOMEHOW_UNSATISFIED: 'Please type the number of somehow unsatisified customers',
    NEITHER_SATISFIED_NOR_UNSATISFIED: 'Please type the number of customers that are neiter satisified nor unsatisified',

    COMMERCIAL_SERVICES: 'Insert the total number of commercial services on site',
    PRODUCTIVE_SERVICES: 'Insert the total number of productive users/services on site',
    HEALTH_SERVICES: 'Insert the number of health facilities on site',
    EDUCATION_SERVICES: 'Insert the number of educational facilities, e.g. schools on site',

    RESIDENTIAL_TARFIFF: 'Please insert the value of the residential tariff here. If the tariff is not flat, take an average.',
    COMMERCIAL_TARFIFF: 'Please insert the value of the commercial tariff here. If the tariff is not flat, take an average.',
    PRODUCTIVE_TARFIFF: 'Please insert the value of the productive tariff here. If the tariff is not flat, take an average.',
    PUBLIC_TARFIFF: 'Please insert the value of the public tariff here. If the tariff is not flat, take an average.',
  };

  static PLACEHOLDERS = {
    CONNECTIONS: 'Number of connections',
    EMPLOYMENT: 'Number of jobs',
    CUSTOMER_SATISFACTION: 'Number of responses',
    SERVICES: 'Number of entities',
    TARFIFF: 'Tariff in ',
  };
}
