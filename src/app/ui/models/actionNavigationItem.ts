import { INavigationItem } from "./INavigationItem";

export class ActionNavigationItem extends INavigationItem {
    label: string;
    icon?: string;
    align: 'left' | 'right' = 'left';
    isLinkItem: boolean = false;
    isActionItem: boolean = true;
    toActionItem = () => {
      return this;
    }
    action?: () => void; 

    constructor(init?: Partial<ActionNavigationItem>) {
      super(init);
      Object.assign(this, init);
    }
  }