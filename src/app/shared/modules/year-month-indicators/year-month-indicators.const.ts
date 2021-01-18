export class YearMonthIndicatorTableConst {
  static TOOLTIPS = {
    ENTER_DATA_REVENUE: 'Please click "edit" to insert monthly revenues per customer group here',
    ENTER_DATA_OPEX: 'Please click "edit" to insert monthly operational expenditure',
    ENTER_DATA_PROGRAMME: 'Please click "edit" to insert/update the specific values. You can also use an Excel upload.',
    ENTER_DATA_CONSUMPTION: 'Use "edit" to insert aggegated monthly electricity consumption for the 4 customer groups. Please also insert the peakload value of the respective months.',
  };

  static COMMON = {
    YEAR: 'year',
    MONTH: 'month',
    ACTIONS: 'actions',
  };

  static CONSUMPTIONS = {
    RESIDENTIAL: 'residential',
    COMMERCIAL: 'commercial',
    PRODUCTIVE: 'productive',
    PUBLIC: 'public',
    PEAK_LOAD: 'peakLoad',
    TOTAL: 'total',
  };

  static REVENUE = {
    RESIDENTIAL: 'residential',
    COMMERCIAL: 'commercial',
    PRODUCTIVE: 'productive',
    PUBLIC: 'public',
  };

  static OPEX = {
    SITE_SPECIFIC: 'siteSpecific',
    COMPANY_LEVEL: 'companyLevel',
    TAXES: 'taxes',
    LOAN_REPAYMENTS: 'loanRepayments',
  };

  static PROGRAMME = {
    VALUE: 'value',
  };

  static TITLE = {
    CONSUMPTIONS_RESIDENTIAL: 'Residential [kWh]',
    CONSUMPTIONS_COMMERCIAL: 'Commercial [kWh]',
    CONSUMPTIONS_PRODUCTIVE: 'Productive [kWh]',
    CONSUMPTIONS_PUBLIC: 'Public [kWh]',
    CONSUMPTIONS_PEAK_LOAD: 'Peak Load [kW]',
    CONSUMPTIONS_TOTAL: 'Total',
    REVENUE_RESIDENTIAL: 'Residential',
    REVENUE_COMMERCIAL: 'Commercial',
    REVENUE_PRODUCTIVE: 'Productive',
    REVENUE_PUBLIC: 'Public',
    OPEX_SITE_SPECIFIC: 'Site specific',
    OPEX_COMPANY_LEVEL: 'Company level',
    OPEX_TAXES: 'Taxes',
    OPEX_LOAN_REPAYMENTS: 'Loan Repayments',
  };
}
