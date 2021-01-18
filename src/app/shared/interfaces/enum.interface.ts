export interface IEnum<T> {
  value: T;
  label: string;
  // frontent properties
  disabled: boolean; // for filters
  selected: boolean;
}
