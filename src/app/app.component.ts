import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  template: `
    <form [formGroup]="form">
      <!-- Dropdown for Severity -->
      <mat-form-field>
        <mat-label>Severity</mat-label>
        <mat-select formControlName="severity">
          <mat-option *ngFor="let option of severityOptions" [value]="option">
            {{ option }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <!-- Dropdown for Component -->
      <mat-form-field>
        <mat-label>Component</mat-label>
        <mat-select formControlName="component">
          <mat-option *ngFor="let option of componentOptions" [value]="option">
            {{ option }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <!-- Dropdown for Channel Name -->
      <mat-form-field>
        <mat-label>Channel Name</mat-label>
        <mat-select formControlName="channelName">
          <mat-option *ngFor="let option of channelNameOptions" [value]="option">
            {{ option }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <!-- Button Toggle for Deficiency -->
      <mat-button-toggle-group formControlName="deficiency">
        <mat-button-toggle *ngFor="let option of deficiencyOptions" [value]="option">
          {{ option }}
        </mat-button-toggle>
      </mat-button-toggle-group>

      <!-- Textarea with Readonly Prefix -->
      <textarea
        formControlName="textarea"
        (input)="onUserInput($event)"
      ></textarea>
    </form>
  `,
  styles: [
    `
      textarea {
        width: 100%;
        height: 100px;
      }
      mat-form-field {
        margin-right: 16px;
      }
      mat-button-toggle-group {
        margin-bottom: 16px;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  form!: FormGroup;
  readonlyPrefix = ''; // Stores the readonly prefix

  // Dropdown and toggle options
  severityOptions = ['Low', 'Medium', 'High'];
  componentOptions = ['UI', 'API', 'Database'];
  channelNameOptions = ['Email', 'SMS', 'Push Notification'];
  deficiencyOptions = ['Yes', 'No'];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // Initialize the form
    this.form = this.fb.group({
      severity: [''],
      component: [''],
      channelName: [''],
      deficiency: [''],
      textarea: [''],
    });

    // Watch for dropdown and button toggle changes
    this.form.get('severity')!.valueChanges.subscribe(() => this.updateTextarea());
    this.form.get('component')!.valueChanges.subscribe(() => this.updateTextarea());
    this.form.get('channelName')!.valueChanges.subscribe(() => this.updateTextarea());
    this.form.get('deficiency')!.valueChanges.subscribe(() => this.updateTextarea());
  }

  // Update the readonly prefix and textarea value
  updateTextarea() {
    const { severity, component, channelName, deficiency } = this.form.value;

    // Generate the readonly text dynamically
    this.readonlyPrefix = [severity, component, channelName, deficiency]
      .filter(Boolean) // Ensures no empty values appear in the output
      .join(' - ');

    if (this.readonlyPrefix) {
      this.readonlyPrefix += '\n';
    }

    // Get user-entered text
    const userText = this.getUserEnteredText();

    // Set new textarea value without triggering another valueChange
    this.form.get('textarea')!.setValue(this.readonlyPrefix + userText, { emitEvent: false });
  }

  // Handle input events to ensure the readonly prefix is not modified
  onUserInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    // Ensure the readonly prefix is not modified
    if (!textarea.value.startsWith(this.readonlyPrefix)) {
      textarea.value = this.readonlyPrefix + this.getUserEnteredText();
    }
  }

  // Extract the user-entered text
  getUserEnteredText(): string {
    const currentValue = this.form.get('textarea')?.value || '';
    return currentValue.startsWith(this.readonlyPrefix) ? currentValue.slice(this.readonlyPrefix.length) : '';
  }
}
