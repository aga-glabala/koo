import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Helper } from 'src/app/models/person';

@Component({
  selector: 'koo-helpers',
  templateUrl: './helpers.component.html'
})
export class HelpersEditorComponent {
  @Input() helpers: Helper[];
  public form: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      person: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required])
    });
  }

  addNewHelper() {
    this.helpers.push(new Helper(this.form.value.person, this.form.value.description));
    this.form.reset();
  }

  removeHelper(id: number) {
    this.helpers.splice(id, 1);
  }
}