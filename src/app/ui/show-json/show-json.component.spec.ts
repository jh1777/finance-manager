import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowJsonComponent } from './show-json.component';

describe('ShowJsonComponent', () => {
  let component: ShowJsonComponent;
  let fixture: ComponentFixture<ShowJsonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowJsonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
