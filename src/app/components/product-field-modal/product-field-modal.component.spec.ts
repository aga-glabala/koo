import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductFieldModalComponent } from './product-field-modal.component';

describe('ProductFieldModalComponent', () => {
  let component: ProductFieldModalComponent;
  let fixture: ComponentFixture<ProductFieldModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductFieldModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFieldModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
