import {
  Component,
  Input,
  OnInit,
  Optional,
  Output,
  Self,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-input-with-label',
  imports: [],
  templateUrl: './input-with-label.html',
  styleUrl: './input-with-label.css',
})
export class InputWithLabel implements ControlValueAccessor {
  @Input() label: string = 'Label';
  @Input() type: string = 'text';
  @Input() placeholder: string = 'Enter the value';
  @Input() styles: string = '';
  value: string = '';

  disaled: boolean = false;

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }
  get concatClass(): string[] {
    return [
      'input',
      this.hasError ? 'error' : '',
      ...this.styles.trim().split(/\s+/),
    ];
  }

  writeValue(val: any): void {
    this.value = val || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disaled = isDisabled;
  }

  onChange = (_: any) => {};
  onTouched = () => {};

  handleInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }

  get hasError(): boolean {
    return !!this.ngControl?.invalid && !!this.ngControl?.touched;
  }

  get errorMessage(): string | null {
    if (!this.ngControl?.errors) return null;
    if (this.ngControl.errors['required']) return 'This field is required';
    if (this.ngControl.errors['minlength'])
      return `Minimum length is ${this.ngControl.errors['minlength'].requiredLength}`;
    if (this.ngControl.errors['maxlength'])
      return `Maximum length is ${this.ngControl.errors['maxlength'].requiredLength}`;
    return 'Invalid field';
  }
}
