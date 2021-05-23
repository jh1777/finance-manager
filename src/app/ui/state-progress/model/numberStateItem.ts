import { StateItem } from "./stateItem";

export class NumberStateItem extends StateItem {
    value: number;
    constructor(init?: Partial<NumberStateItem>) {
        super(init);
        Object.assign(this, init);
    }
}