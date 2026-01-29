import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NotEmptyDirective } from './not-empty.directive';

@Component({
  standalone: true,
  imports: [NotEmptyDirective],
  template: '<div *appNotEmpty="items">content</div>',
})
class TestHostComponent {
  items: unknown[] = [];
}

describe('NotEmptyDirective', () => {
  it('should not render when array is empty', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.items = [];
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent?.trim()).toBe('');
  });

  it('should render when array has items', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.items = [1, 2];
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent?.trim()).toContain(
      'content'
    );
  });
});
