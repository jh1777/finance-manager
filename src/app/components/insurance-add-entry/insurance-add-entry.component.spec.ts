import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceAddEntryComponent } from './insurance-add-entry.component';

describe('InsuranceAddEntryComponent', () => {
  let component: InsuranceAddEntryComponent;
  let fixture: ComponentFixture<InsuranceAddEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceAddEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceAddEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
