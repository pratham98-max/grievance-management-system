import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LodgeComplaint } from './lodge-complaint.component';

describe('LodgeComplaint', () => {
  let component: LodgeComplaint;
  let fixture: ComponentFixture<LodgeComplaint>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LodgeComplaint],
    }).compileComponents();

    fixture = TestBed.createComponent(LodgeComplaint);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
