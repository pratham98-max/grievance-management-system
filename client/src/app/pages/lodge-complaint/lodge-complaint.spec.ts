import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LodgeComplaintComponent } from './lodge-complaint.component';

describe('LodgeComplaint', () => {
  let component: LodgeComplaintComponent;
  let fixture: ComponentFixture<LodgeComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LodgeComplaintComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LodgeComplaintComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
