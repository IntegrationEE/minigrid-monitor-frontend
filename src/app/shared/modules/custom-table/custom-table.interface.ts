import { Action, ColumnType } from '@shared/enums';

export interface ITableActions {
  create: boolean;
  edit: (element: unknown) => any;
  delete: boolean;
  customs?: ICustomAction[];
}

export interface ITableColumn {
  arrKey?: string;
  arrValue?: string;
  name: string;
  searchable?: boolean;
  sortable?: boolean;
  title?: string;
  type: ColumnType;
  value?: string;
}

export interface ITableAction<T> {
  action: Action;
  model: T;
}

export interface ITableConfig {
  table: string;
  actions: ITableActions;
  columns: ITableColumn[];
}

export interface ICustomAction {
  enabled: (element: unknown) => any;
  label: string;
  action?: (element: unknown) => any;
}
