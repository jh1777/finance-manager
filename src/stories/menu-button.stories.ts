import { Story, Meta } from '@storybook/angular/types-6-0';
import { MenuButtonComponent } from '../app/ui/ui.module';

export default {
    title: 'app-menu-button',
    component: MenuButtonComponent,
    argTypes: {
        label: { control: 'string' },
        clickEvent: { action: 'action' }
    },
    args: {
        label: "Button",
    }
} as Meta;

const Template: Story<MenuButtonComponent> = (args) => ({
    props: args
});

export const Default = Template.bind({});