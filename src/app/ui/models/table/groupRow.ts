import { TableRow } from "./tableRow";

export class GroupRow extends TableRow {
    groupLabel: string;
    icon: string;

    constructor(init?: Partial<GroupRow>) {
        super();
        Object.assign(this, init);
    }
}