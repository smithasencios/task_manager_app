import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appNotEmpty]',
  standalone: true,
})
export class NotEmptyDirective implements OnChanges {
  @Input() appNotEmpty: unknown[] | null | undefined = null;

  constructor(
    private readonly templateRef: TemplateRef<unknown>,
    private readonly vcr: ViewContainerRef
  ) {}

  ngOnChanges(_changes: SimpleChanges): void {
    const arr = this.appNotEmpty;
    this.vcr.clear();
    if (arr != null && arr.length > 0) {
      this.vcr.createEmbeddedView(this.templateRef);
    }
  }
}
