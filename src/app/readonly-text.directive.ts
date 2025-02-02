import { Directive, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appReadonlyText]',
  standalone: true
})
export class ReadonlyTextDirective implements OnChanges {
  @Input('appReadonlyText') readonlyText: string = '';

  constructor(private el: ElementRef<HTMLTextAreaElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    let value = textarea.value;

    if (!value.startsWith(this.readonlyText)) {
      textarea.value = this.readonlyText + value.substring(this.readonlyText.length);
    }
  }

  @HostListener('focus')
  onFocus() {
    setTimeout(() => {
      const textarea = this.el.nativeElement;
      textarea.setSelectionRange(this.readonlyText.length, this.readonlyText.length);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['readonlyText']) {
      const textarea = this.el.nativeElement;
      const userInput = textarea.value.replace(/^.*?:\s*/, '');
      textarea.value = this.readonlyText + userInput;
    }
  }
}
