import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryYearTileComponent } from './salary-year-tile.component';

describe('SalaryYearTileComponent', () => {
  let component: SalaryYearTileComponent;
  let fixture: ComponentFixture<SalaryYearTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryYearTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryYearTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
