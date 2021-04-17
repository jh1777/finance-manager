import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineButtonGroupComponent } from './inline-button-group.component';

describe('InlineButtonGroupComponent', () => {
  let component: InlineButtonGroupComponent;
  let fixture: ComponentFixture<InlineButtonGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InlineButtonGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
