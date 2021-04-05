import { ActionNavigationItem } from "./actionNavigationItem";
import { LinkNavigationItem } from "./linkNavigationItem";

export interface INavigationItem {
    label: string;
    icon?: string;
    align: 'left' | 'right';
    isLinkItem: boolean;
    isActionItem: boolean;
    toLinkItem?: () => LinkNavigationItem;
    toActionItem?: () => ActionNavigationItem;
  }