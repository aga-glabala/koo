import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotAcceptedComponent } from './not-accepted.component';

describe('NotAcceptedComponent', () => {
  let component: NotAcceptedComponent;
  let fixture: ComponentFixture<NotAcceptedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotAcceptedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotAcceptedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
