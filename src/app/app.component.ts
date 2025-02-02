import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReadonlyTextDirective } from './readonly-text.directive';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReadonlyTextDirective],
  templateUrl: './app.component.html',
 styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  form!: FormGroup;
  names = ['John', 'Jane', 'Alice', 'Bob'];
  surnames = ['Smith', 'Doe', 'Brown', 'Wilson'];
  readonlyText = 'John Smith: '; // Default readonly text

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: new FormControl('John'),
      surname: new FormControl('Smith'),
      textarea: new FormControl(this.readonlyText) // Set initial value
    });

    // Listen for changes in dropdowns
    this.form.controls['name'].valueChanges.subscribe(() => this.updateReadonlyText());
    this.form.controls['surname'].valueChanges.subscribe(() => this.updateReadonlyText());
  }

  updateReadonlyText() {
    const name = this.form.controls['name'].value;
    const surname = this.form.controls['surname'].value;
    this.readonlyText = `${name} ${surname}: `;

    // Update the textarea while preserving user input
    const userInput = this.form.controls['textarea'].value.replace(/^.*?:\s*/, '');
    this.form.controls['textarea'].setValue(this.readonlyText + userInput, { emitEvent: false });
  }
}
