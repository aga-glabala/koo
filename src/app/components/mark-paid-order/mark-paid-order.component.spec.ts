import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkPaidOrderComponent } from './mark-paid-order.component';

describe('MarkPaidOrderComponent', () => {
  let component: MarkPaidOrderComponent;
  let fixture: ComponentFixture<MarkPaidOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkPaidOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkPaidOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
