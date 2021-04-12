import { INavigationItem } from "./INavigationItem";

export class LinkNavigationItem extends INavigationItem{
    label: string;
    icon?: string;
    link: string;
    isLinkItem: boolean = true;
    isActionItem: boolean = false;
    toLinkItem = () => {
      return this;
    }
    align: 'left' | 'right' = 'left';
    
    constructor(init?: Partial<LinkNavigationItem>) {
      super(init);
      Object.assign(this, init);
    }
  }