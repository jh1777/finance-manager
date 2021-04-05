import { INavigationItem } from "./INavigationItem";

export class ActionNavigationItem implements INavigationItem{
    label: string;
    icon?: string;
    align: 'left' | 'right' = 'left';
    isLinkItem: boolean = false;
    isActionItem: boolean = true;
    toActionItem = () => {
      return this;
    }
    action?: () => void; 
    constructor(label: string) {
      this.label = label;
    }
  }