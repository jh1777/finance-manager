import { TableRow } from "./tableRow";

export class GroupRow extends TableRow {
    groupLabel: string;
    itemCount: number;
    isCollapsed: boolean = false;
    summarizedData?: Array<number> = [];

    constructor(init?: Partial<GroupRow>) {
        super();
        Object.assign(this, init);
    }
}