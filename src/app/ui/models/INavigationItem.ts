import { ActionNavigationItem } from "./actionNavigationItem";
import { LinkNavigationItem } from "./linkNavigationItem";

export abstract class INavigationItem {
    label: string;
    icon?: string;
    align: 'left' | 'right';
    isLinkItem: boolean;
    isActionItem: boolean;
    toLinkItem?: () => LinkNavigationItem;
    toActionItem?: () => ActionNavigationItem;

    constructor(init?: Partial<INavigationItem>) {
      Object.assign(this, init);
    }
}