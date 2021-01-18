import { IChartMetadata } from '@shared/modules';

export interface ISocialData {
  peopleConnected: IChartMetadata;
  employmentCreated: IChartMetadata;
  newServicesAvailable: IChartMetadata;
  customerSatisfaction: IChartMetadata;
  complaints: number;
}

export interface ITechnicalData {
  installedCapacity: IChartMetadata;
  averageConsumption: IChartMetadata;
  electricityConsumption: IChartMetadata;
  capacityUtilization: IChartMetadata;
  dailyProfile: IChartMetadata;
}

export interface IFinancialData {
  financingStructure: IChartMetadata;
  opexStructure: IChartMetadata;
  opexPricePerConnection: number;
  capexStructure: IChartMetadata;
  capexPricePerConnection: number;
  revenue: IChartMetadata;
}
