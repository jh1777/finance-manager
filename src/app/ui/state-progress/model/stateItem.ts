import { State } from "./state";

export abstract class StateItem {
    state: State = State.NONE;
    label: string;
    description: string;

    constructor(init?: Partial<StateItem>) {
        Object.assign(this, init);
    }
}