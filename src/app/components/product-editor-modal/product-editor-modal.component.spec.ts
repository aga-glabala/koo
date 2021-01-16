import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductEditorModalComponent } from './product-editor-modal.component';

describe('ProductEditorModalComponent', () => {
  let component: ProductEditorModalComponent;
  let fixture: ComponentFixture<ProductEditorModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductEditorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
