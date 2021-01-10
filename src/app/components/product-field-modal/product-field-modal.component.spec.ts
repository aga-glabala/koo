import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFieldModalComponent } from './product-field-modal.component';

describe('ProductFieldModalComponent', () => {
  let component: ProductFieldModalComponent;
  let fixture: ComponentFixture<ProductFieldModalComponent>;

  beforeEach(async(() => {
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
