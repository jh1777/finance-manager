import { Story, Meta } from '@storybook/angular/types-6-0';
import { DefaultStateItem } from 'src/app/ui/state-progress/model/defaultStateItem';
import { State } from 'src/app/ui/state-progress/model/state';
import { StateProgressComponent } from '../app/ui/ui.module';

export default {
    title: 'app-state-progress',
    component: StateProgressComponent,
    argTypes: {
        states: { control: 'object' },
        size: { control: 'string' }
    },
    args: {
        states: [
            {
                state: State.SUCCESS
            } as DefaultStateItem,
            {
                state: State.FAILED
            } as DefaultStateItem,
            {
                state: State.IN_PROGRESS
            } as DefaultStateItem,
        ],
        size: 'M' 
    }
} as Meta;

const Template: Story<StateProgressComponent> = (args) => ({
    props: args
});

export const Default = Template.bind({});