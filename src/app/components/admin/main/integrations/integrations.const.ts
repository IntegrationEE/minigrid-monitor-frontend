export class Integrations {
  static BUTTONS = {
    EXECUTE: 'Execute',
    SHOW_RUNS: 'Show runs',
  };
}

export class IntegrationsTable {
  static COLUMNS = {
    NAME: 'name',
    TOKEN: 'token',
    INTERVAL: 'interval',
    QUESTION_HASH: 'questionHash',
    IS_ACTIVE: 'isActive',
    ACTIONS: 'actions',
  };
}

export class IntegrationRecordsTable {
  static COLUMNS = {
    STATUS: 'status',
    ERROR: 'error',
    INSERTED: 'inserted',
    CREATED: 'created',
    END_DATE: 'endDate',
    STEP: 'stepName',
  };
}
