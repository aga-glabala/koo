import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowViewComponent } from './row-view.component';

describe('RowViewComponent', () => {
  let component: RowViewComponent;
  let fixture: ComponentFixture<RowViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RowViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RowViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
