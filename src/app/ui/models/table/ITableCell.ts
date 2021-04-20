export interface ITableCell {
    label: string;
    id?: number;
    type: 'text' | 'header';
    actionIcon?: string;
    action?: () => void;
}