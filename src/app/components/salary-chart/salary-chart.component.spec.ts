import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryChartComponent } from './salary-chart.component';

describe('SalaryChartComponent', () => {
  let component: SalaryChartComponent;
  let fixture: ComponentFixture<SalaryChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
