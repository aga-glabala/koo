import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportProductsModalComponent } from './import-products-modal.component';

describe('ImportProductsModalComponent', () => {
  let component: ImportProductsModalComponent;
  let fixture: ComponentFixture<ImportProductsModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportProductsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportProductsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
