import { Story, Meta } from '@storybook/angular/types-6-0';
import { PageHeaderComponent } from '../app/ui/ui.module';

export default {
    title: 'app-page-header',
    component: PageHeaderComponent
} as Meta;

const Template: Story<PageHeaderComponent> = (args) => ({
    props: args
});

export const Default = Template.bind({});