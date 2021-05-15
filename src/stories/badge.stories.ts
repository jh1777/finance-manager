// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { BadgeComponent, NavigationBarComponent, UiModule } from '../app/ui/ui.module';
import { moduleMetadata } from '@storybook/angular';

export default {
    title: 'app-badge',
    component: BadgeComponent
} as Meta;

const Template: Story<BadgeComponent> = (args) => ({
    props: args,
});


export const Default = Template.bind({});
Default.args = { label: 'Default' };

export const Green = Template.bind({});
Green.args = { label: 'Geen', filled: false, customClass: 'green' };

export const Red = Template.bind({});
Red.args = { label: 'Red', filled: false, customClass: 'red' }

export const FilledGreen = Template.bind({});
FilledGreen.args = { label: 'Geen', filled: true, customClass: 'green' };

export const FilledRed = Template.bind({});
FilledRed.args = { label: 'Red', filled: true, customClass: 'red' };