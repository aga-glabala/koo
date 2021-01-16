import { Component, Input } from '@angular/core';

@Component({
  selector: '[form-input]',
  template: `
    <div class="form-group row">
      <label for="newacion-{{name}}" class="col-sm-2 col-md-3 col-form-label">{{label}}</label>
      <div class="col-sm-10 col-md-6">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class FormInputComponent {
  @Input() name: string;
  @Input() label: string;

}
