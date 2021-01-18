export enum SiteStatus {
  UP_TO_DATE = 1,
  INFORMATION_MISSING,
  OUT_OF_OPERATION,
}

export enum GridConnection {
  ON_GRID = 1,
  OFF_GRID,
}

export enum RenewableTechnology {
  PV = 1,
  HYDRO,
  WIND,
  BIOMASS,
}

export enum ConventionalTechnology {
  DIESEL = 1,
  BIODIESEL,
}

export enum StorageTechnology {
  BATTERY = 1,
}
