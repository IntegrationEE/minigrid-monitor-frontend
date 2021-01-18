import { IChart } from '../overview.interface';

export interface IPortfolioCharts {
  peopleConnected: IPortfolioChart;
  communitiesConnected: IPortfolioChart;
  installedRenewableEnergyCapacity: IPortfolioChart;
  electricityConsumed: IPortfolioChart;
  totalInvestment: IPortfolioChart;
  averageTariff: IPortfolioChart;
}

export interface IPortfolioChart extends IChart {
  trendValue: number;
  key: number;
}
