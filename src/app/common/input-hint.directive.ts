import { Directive, Input, ElementRef, Renderer2, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appInputHint]'
})
export class InputHintDirective implements OnInit {
  @Input('appInputHint') errorName!: string;
  @Input('maxlength') maxLength!: string;

  private length!: number;
  private lengthEle!: ElementRef;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private control: NgControl
  ) {}

  ngOnInit() {
    this.createInputHint();
    this.control.control!.statusChanges
    .subscribe(() => {
      let controlErrors = this.control.errors;
      if (controlErrors && controlErrors[this.errorName] && (this.control.dirty || this.control.touched)) {
        this.displayError();
        } else {
        this.removeError();
      }
    });
    this.control.control!.valueChanges
    .subscribe((value:string) => {
      this.length = value.length ?? 0;
      this.renderer.setProperty(this.lengthEle, 'textContent', `${this.length} / ${this.maxLength}`);
    });
  }

  private createInputHint(): void {
    let hintElement = this.el.nativeElement.nextElementSibling;
    if (!hintElement || !hintElement.classList.contains('input-hint')) {
      hintElement = this.renderer.createElement('div');
      this.renderer.addClass(hintElement, 'input-hint');
      this.renderer.addClass(hintElement, 'flex');
      this.renderer.addClass(hintElement, 'justify-between');
      this.renderer.insertBefore(this.el.nativeElement.parentNode, hintElement, this.el.nativeElement.nextSibling);
      let errorElement = this.renderer.createElement('p');
      this.renderer.addClass(errorElement, 'error-message');
      this.renderer.appendChild(hintElement, errorElement);
      let lengthElement = this.renderer.createElement('p');
      this.renderer.addClass(lengthElement, 'input-hint-length');
      this.renderer.appendChild(hintElement, lengthElement);
      this.lengthEle = lengthElement;
    }
  }

    private displayError(): void {
    let errorElement = this.el.nativeElement.nextElementSibling;
    if (!errorElement || errorElement.classList.contains('input-hint')) {
      for (let child of errorElement.children) {
        if (child.classList.contains('error-message')) {
          this.renderer.setProperty(child, 'textContent', this.getErrorMessage());
          break;
        }
      }
    }
  }

  private removeError(): void {
    let errorElement = this.el.nativeElement.nextElementSibling;
    if (!errorElement || errorElement.classList.contains('input-hint')) {
      for (let child of errorElement.children) {
        if (child.classList.contains('error-message')) {
          this.renderer.setProperty(child, 'textContent', '');
          break;
        } 
      }
    }
  }
 
  private getErrorMessage(): string {
    switch (this.errorName) {
      case 'required':
        return 'Field is required.';
      case 'minlength':
        return `Minimum length is ${this.control.errors!['minlength'].requiredLength} characters.`;
      case 'pattern':
        return 'Invalid input format.';
      case 'not-required':
        return '';
      default:
        return 'Invalid input.';
    }
  }
}
