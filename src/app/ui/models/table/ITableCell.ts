export interface ITableCell {
    label: string;
    id?: number;
    numericValue?: number;
    actionIcon?: string;
    action?: () => void;
}