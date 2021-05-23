import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NumberStateItem } from './model/numberStateItem';
import { State } from './model/state';
import { StateItem } from './model/stateItem';

@Component({
  selector: 'app-state-progress',
  templateUrl: './state-progress.component.html',
  styleUrls: ['./state-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateProgressComponent {
// WORKS ONLY WITH CLARITY 3/4!!

  /**
   * Internally used Enum helper to use in Template
   */
  StateEnum = State;

  /**
   * List of StateItems to ne shown as Progress Component   
   * This can be of type `DefaultStateItem` or `NumberStateItem`
   */
  @Input()
  states: Array<StateItem>;

  /**
   * State Progress Size in categories   
   * Basesize (size of one `StateItem`):
   * - S: 20px  
   * - M: 25px  
   * - L: 30px  
   * 
   */
  @Input()
  size: 'M' | 'S' | 'L' = 'S';

  @Output()
  onClick = new EventEmitter<StateItem>();

  @Output()
  onMouseOver = new EventEmitter<StateItem>();

  constructor() { 
  }

  getIconSize(): number {
    switch (this.size) {
      case 'M':
        return 25;
      case 'L':
        return 30;
      case 'S':
        return 20;
      default:
        return 0;
    }
  }

  /**
   * Handles a click on one `StateItem`
   * @param item StateItem
   */
  public handleStepClick(item: StateItem) {
    this.onClick.emit(item);
  }

  /**
   * Handles the mouse over event on one `StateItem` 
   * @param item StateItem
   */
  public handleStepHover(item: StateItem) {
    this.onMouseOver.emit(item);
  } 

  /**
   * Is this State Item a `NumberStateItem`   
   * (used in template only)
   * @param index number
   * @returns boolean
   */
  isNumberState(index: number): boolean {
    return this.states[index] instanceof NumberStateItem;
  }

  /**
   * Returns the foreground color for a `NumberStateItem` based on its state   
   * *(used in template only)*
   * @param state State (Enum)
   * @returns string
   */
  colorClassForNumberState(state: State): string {
    switch (state) {
      case State.FAILED:
        return '#F20D0D';
      case State.SUCCESS:
        return '#57CC33';
      case State.WARNING:
        return '#E6A91A';
      default:
        break;
    }
    return '';
  }

  /**
   * Returns the background color for a `NumberStateItem` based on its state   
   * *(used in template only)*
   * @param state State (Enum)
   * @returns string
   */
  bgColorClassForNumberState(state: State): string {
    switch (state) {
      case State.FAILED:
        return '#FBB9B9';
      case State.SUCCESS:
        return '#D1F1C7';
      case State.WARNING:
        return '#F3D58F';
      default:
        break;
    }
    return '';
  }
}