import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryAddEntryComponent } from './salary-add-entry.component';

describe('SalaryAddEntryComponent', () => {
  let component: SalaryAddEntryComponent;
  let fixture: ComponentFixture<SalaryAddEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryAddEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryAddEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
