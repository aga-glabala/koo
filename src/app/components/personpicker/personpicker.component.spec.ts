import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PersonpickerComponent } from './personpicker.component';

describe('PersonpickerComponent', () => {
  let component: PersonpickerComponent;
  let fixture: ComponentFixture<PersonpickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonpickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonpickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
