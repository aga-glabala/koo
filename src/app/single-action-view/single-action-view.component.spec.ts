import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleActionViewComponent } from './single-action-view.component';

describe('SingleActionViewComponent', () => {
  let component: SingleActionViewComponent;
  let fixture: ComponentFixture<SingleActionViewComponent>;

  beforeEach(async(() => {
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
