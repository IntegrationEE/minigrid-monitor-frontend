export class ButtonModel {
  name: string;
  class: string;
  path: string;
  available: boolean;

  constructor(name: string,
              path: string = null,
              available: boolean = false) {
    this.name = name;
    this.path = path ? path : name.toLowerCase().split(' ').join('-');
    this.class = '';
    this.available = available;
  }
}

export class ButtonGroup {
  groupName: string;
  prefix: string;
  expanded?: boolean;
  buttons: ButtonModel[];
  available: boolean;

  constructor(groupName: string,
              prefix: string,
              buttons: ButtonModel[],
              available: boolean = false) {
    this.groupName = groupName;
    this.buttons = buttons || [];
    this.prefix = prefix;
    this.available = available;
  }
}
