import { Directive, Input, ElementRef, Renderer2, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appFormError]'
})
export class FormErrorDirective implements OnInit {
  @Input('appFormError') errorName!: string;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private control: NgControl
  ) {}

  ngOnInit() {
    this.control.control!.statusChanges.subscribe(() => {
      const controlErrors = this.control.errors;
      if (controlErrors && controlErrors[this.errorName] && (this.control.dirty || this.control.touched)) {
        this.displayError();
      } else {
        this.removeError();
      }
    });
  }

  private displayError() {
    let errorElement = this.el.nativeElement.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
       errorElement = this.renderer.createElement('p');
       this.renderer.addClass(errorElement, 'error-message');
       this.renderer.insertBefore(this.el.nativeElement.parentNode, errorElement, this.el.nativeElement.nextSibling);
    }
    this.renderer.setProperty(errorElement, 'textContent', this.getErrorMessage());
    this.renderer.addClass(this.el.nativeElement, 'error-input');
  }

  private removeError() {
     const errorElement = this.el.nativeElement.nextElementSibling;
     if (errorElement && errorElement.classList.contains('error-message')) {
        this.renderer.removeChild(this.el.nativeElement.parentNode, errorElement);
        this.renderer.removeClass(this.el.nativeElement, 'error-input');
     }
  }

  private getErrorMessage(): string {
    switch (this.errorName) {
      case 'required':
        return 'This field is required.';
      case 'minlength':
        return `Minimum length is ${this.control.errors!['minlength'].requiredLength} characters.`;
       case 'pattern':
          return 'Invalid input format.';
      // Add more cases for other error types
      default:
        return 'Invalid input.';
    }
  }
}
