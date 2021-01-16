import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserQueueComponent } from './userqueue.component';

describe('UserQueueComponent', () => {
  let component: UserQueueComponent;
  let fixture: ComponentFixture<UserQueueComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
