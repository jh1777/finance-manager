import { Story, Meta } from '@storybook/angular/types-6-0';
import { TableComponent, UiModule } from '../app/ui/ui.module';
import { TableHeader, NumberTableCell, TableRow, TextTableCell, StyledTextTableCell } from 'src/app/ui';

const header:  Array<TableHeader> = [
    { label: 'No.' },
    { label: 'Name', isSortable: true },
    { label: 'Kategorie', isGroupable: true },
    { label: 'Adresse', isGroupable: true, isSortable: true },
    { label: 'Hausnummer', isSortable: true },
    { label: 'Gehalt', isSortable: true, summarizeWhenGrouped: true }
];
const rows: Array<TableRow> = [];
const row = new TableRow();
row.cells.push(new TextTableCell({ id: 1, label: "1" }));
row.cells.push(new StyledTextTableCell({ id: 1, label: "Max Mustermann", style: {'font-weight':'500'} }));
row.cells.push(new TextTableCell({ id: 1, label: "Person" }));
row.cells.push(new TextTableCell({ id: 1, label: "Musterweg" }));
row.cells.push(new TextTableCell({ id: 1, label: "42" }));
row.cells.push(new NumberTableCell({ id: 1, numericValue: 1234 }));
rows.push(row);
const row2 = new TableRow();
row2.cells.push(new TextTableCell({ id: 2, label: "2" }));
row2.cells.push(new StyledTextTableCell({ id: 2, label: "Klaus Kleber", style: {'font-weight':'500'} }));
row2.cells.push(new TextTableCell({ id: 2, label: "Person" }));
row2.cells.push(new TextTableCell({ id: 2, label: "Vogelweg" }));
row2.cells.push(new TextTableCell({ id: 2, label: "12" }));
row2.cells.push(new NumberTableCell({ id: 2, numericValue: 2345 }));
rows.push(row2);

export default {
    title: 'app-table',
    component: TableComponent,
    argTypes: {
        rows: { control: 'object' },
        header: { control: 'object' },
        footer: { control: 'text' },
        groupColumnIndex: { control: 'number'}
    },
    args: {
        rows: rows,
        header: header,
        footer: "Footer",
        groupColumnIndex: 2
    }
} as Meta;

const Template: Story<TableComponent> = (args) => ({
    props: args
});

export const Default = Template.bind({});
