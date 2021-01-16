import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SingleActionViewComponent } from './single-action-view.component';

describe('SingleActionViewComponent', () => {
  let component: SingleActionViewComponent;
  let fixture: ComponentFixture<SingleActionViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleActionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleActionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
