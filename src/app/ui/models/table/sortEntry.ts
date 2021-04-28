import { TableHeader } from "./tableHeader";

export class SortEntry {
    direction: 'asc' | 'desc';
    column: TableHeader;

    constructor(init?: Partial<SortEntry>) {
        Object.assign(this, init);
    }
}