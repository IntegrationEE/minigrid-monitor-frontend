export class SiteDetailsConst {
  static FINANCIAL_TOOLTIPS = {
    COMMISSIONING: 'Includes all costs related to the commissioning of the sites, e.g. technical support for the first run of the system, etc.',
    CUSTOMER_INSTALLATION: 'Includes all costs related to procurement and installation of connections except taxes and transport, e.g. meters, in-house wiring, etc.',
    DEBT: 'Amount financed by debt.',
    DISTRIBUTION_ASSETS: 'Includes all costs related to procurement and installation of the generation assets except taxes and transport',
    EQUITY: 'Amount financed by developer',
    GENERATION_ASSETS: 'Includes all costs related to procurement and installation of the generation assets except taxes and transport.',
    GRANT: 'Amount financed by grant.',
    LOGISTICS: 'Includes all costs related to the transport of procured items to site.',
    PROJECT_DEVELOPMENT: 'Includes all costs related to the development of the project before installation. This includes e.g. planning, feasibility studies, application for permits and certificates, etc.',
    TAXES: 'Includes all costs related to taxes and duties that occured during all stages of site development, procurement and commissioning.',
  };

  static SITE_INFO = {
    COMMISSIONING_DATE: 'Please select a Commissioning date',
    LOCATION: 'Please insert the location of your Mini Grid in the pre-defined format',
    NAME: 'Please do not use a working name but the name used in the applicaton process',
    PROGRAMME: 'Please select a Programme',
  };

  static TECHNICAL_SPECS = {
    GRID_LENGTH: 'Total length of the distribution grid in km',
    INVERTER_MANUFACTURER: 'Name of the Inverter manufacturer',
    METERING_TYPE: 'Select Metering Type',
    METER_MANUFACTURER: 'Name of the Meter manufacturer. If different meters are being used, please separate with a comma',
    GRID_CONNECTION: 'Please select a Connection Type',
    RENEWABLE_TECHNOLOGY: 'Please select a Renewable Technology',
    CONVENTIONAL_TECHNOLOGY: 'Please select a Conventional Technology',
    STORAGE_TECHNOLOGY: 'Please select a Storage Technology',
    RENEWABLE_CAPACITY: 'Installed renewable capacity in kW',
    CONVENTIONAL_CAPACITY: 'Installed conventional capacity in kW',
    STORAGE_CAPACITY: 'Installed storage capacity in kW',
  };
}
