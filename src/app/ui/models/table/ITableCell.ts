export interface ITableCell {
    label: string;
    id?: string;
    numericValue?: number;
    actionIcon?: string;
    action?: () => void;
}