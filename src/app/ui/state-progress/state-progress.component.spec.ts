import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateProgressComponent } from './state-progress.component';

describe('StateProgressComponent', () => {
  let component: StateProgressComponent;
  let fixture: ComponentFixture<StateProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StateProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
