import { INavigationItem } from "./INavigationItem";

export class TextNavigationItem implements INavigationItem{
    label: string;
    icon?: string;
    align: 'left' | 'right' = 'left';
    isLinkItem: boolean = false;
    isActionItem: boolean = false;
    showBold: boolean = false;
    constructor(label: string) {
      this.label = label;
    }
  }