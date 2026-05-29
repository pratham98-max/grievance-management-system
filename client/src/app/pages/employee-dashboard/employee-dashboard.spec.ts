import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDashboardcomponent} from './employee-dashboard.component';

describe('EmployeeDashboard', () => {
  let component: EmployeeDashboardcomponent;
  let fixture: ComponentFixture<EmployeeDashboardcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDashboardcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeDashboardcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
