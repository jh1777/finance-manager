import { TableRow } from "./tableRow";

export class GroupRow extends TableRow {
    groupLabel: string;
    icon: string;
    itemCount: number;
    isCollapsed: boolean = false;

    constructor(init?: Partial<GroupRow>) {
        super();
        Object.assign(this, init);
    }
}