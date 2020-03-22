import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewActionComponent } from './newaction.component';

describe('NewactionComponent', () => {
  let component: NewActionComponent;
  let fixture: ComponentFixture<NewActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
