// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { ActionNavigationItem, LinkNavigationItem, TextNavigationItem } from 'src/app/ui';
import { NavigationBarComponent } from '../app/ui/ui.module';

export default {
    title: 'app-navigation-bar',
    component: NavigationBarComponent,
    parameters: { actions: { argTypesRegex: '^on.*' } },
    argTypes: {
        items: { control: 'object' }
    },
    args: {
        items: [
            { label: 'Text Item' } as TextNavigationItem,
            { label: 'Link Item', isLinkItem: true } as LinkNavigationItem,
            { label: 'Action Item', isActionItem: true, onClick: () => {} } as ActionNavigationItem
        ]
    }
} as Meta;


const Template: Story<NavigationBarComponent> = (args) => ({
    props: args,
});

export const Default = Template.bind({});