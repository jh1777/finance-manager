import { Story, Meta } from '@storybook/angular/types-6-0';
import { ShowJsonComponent } from '../app/ui/ui.module';

export default {
    title: 'app-show-json',
    component: ShowJsonComponent,
    argTypes: {
        content: { control: 'string' }
    },
    args: {
        content: "{ id: 1, label: 'test' }"
    }
} as Meta;

const Template: Story<ShowJsonComponent> = (args) => ({
    props: args
});

export const Default = Template.bind({});