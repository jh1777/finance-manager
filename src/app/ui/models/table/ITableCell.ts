export interface ITableCell {
    label: string;
    id?: number;
    actionIcon?: string;
    action?: () => void;
}