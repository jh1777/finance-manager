import { INavigationItem } from "./INavigationItem";

export class LinkNavigationItem implements INavigationItem{
    label: string;
    icon?: string;
    link: string;
    isLinkItem: boolean = true;
    isActionItem: boolean = false;
    toLinkItem = () => {
      return this;
    }
    align: 'left' | 'right' = 'left';
    constructor(label: string) {
      this.label = label;
    }
  }