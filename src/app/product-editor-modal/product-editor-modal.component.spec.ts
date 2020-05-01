import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductEditorModalComponent } from './product-editor-modal.component';

describe('ProductEditorModalComponent', () => {
  let component: ProductEditorModalComponent;
  let fixture: ComponentFixture<ProductEditorModalComponent>;

  beforeEach(async(() => {
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
