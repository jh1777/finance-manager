export interface ITableCell {
    label: string;
    id?: number;
    type: 'text' | 'header' | 'group';
    actionIcon?: string;
    action?: () => void;
}