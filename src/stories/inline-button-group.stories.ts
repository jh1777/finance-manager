import { Story, Meta } from '@storybook/angular/types-6-0';
import { Button } from 'src/app/ui';
import { InlineButtonGroupComponent } from '../app/ui/ui.module';

export default {
    title: 'app-inline-button-group',
    component: InlineButtonGroupComponent,
    argTypes: {
        buttons: { control: 'object' },
        multiSelect: { control: 'boolean' },
        selectedButtons: { action: 'buttonClicked' }
    },
    args: {
        buttons: [
            { label: 'Button #1' } as Button,
            { label: 'Button #2' } as Button,
            { label: 'Button #3' } as Button
        ],
        multiSelect: false
    }
} as Meta;

const Template: Story<InlineButtonGroupComponent> = (args) => ({
    props: args
});

export const Default = Template.bind({});