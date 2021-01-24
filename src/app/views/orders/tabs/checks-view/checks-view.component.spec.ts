import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecksViewComponent } from './checks-view.component';

describe('ChecksViewComponent', () => {
  let component: ChecksViewComponent;
  let fixture: ComponentFixture<ChecksViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecksViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecksViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
