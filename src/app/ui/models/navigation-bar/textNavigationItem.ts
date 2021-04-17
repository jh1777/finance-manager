import { INavigationItem } from "./INavigationItem";

export class TextNavigationItem extends INavigationItem{
    label: string;
    icon?: string;
    align: 'left' | 'right' = 'left';
    isLinkItem: boolean = false;
    isActionItem: boolean = false;
    showBold: boolean = false;

    constructor(init?: Partial<TextNavigationItem>) {
      super(init);
      Object.assign(this, init);
    }
  }