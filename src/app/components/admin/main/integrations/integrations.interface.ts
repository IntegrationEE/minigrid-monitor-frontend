export interface IIntegration {
  id: number;
  name: string;
  token: string;
  interval: number;
  questionHash: string;
  isActive: boolean;
  steps?: IIntegrationStep[];
}

export interface IIntegrationRecords {
  id: number;
  integrationId: number;
  value: string;
  status: string;
  error: string;
  stepName: string;
  inserted: number;
  created: Date;
  endDate: Date;
}

export interface IIntegrationStep {
  id: number;
  name: string;
  function: string;
  ordinal: number;
  // frontend properties
  isOpen?: boolean;
  timestamp: number;
}
