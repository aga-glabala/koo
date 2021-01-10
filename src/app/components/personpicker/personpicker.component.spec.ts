import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonpickerComponent } from './personpicker.component';

describe('PersonpickerComponent', () => {
  let component: PersonpickerComponent;
  let fixture: ComponentFixture<PersonpickerComponent>;

  beforeEach(async(() => {
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
