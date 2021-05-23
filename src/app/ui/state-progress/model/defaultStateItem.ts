import { StateItem } from "./stateItem";

export class DefaultStateItem extends StateItem {
    constructor(init?: Partial<DefaultStateItem>) {
        super(init);
    }
}