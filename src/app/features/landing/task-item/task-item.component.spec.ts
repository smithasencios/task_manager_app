import { TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TaskItemComponent } from './task-item.component';
import { MatDialog } from '@angular/material/dialog';
import type { Task } from '../../../core/models/task.model';

describe('TaskItemComponent', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test task',
    description: 'Description',
    status: 'PENDING',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskItemComponent],
      providers: [
        provideAnimations(),
        { provide: MatDialog, useValue: { open: vi.fn() } },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TaskItemComponent);
    fixture.componentInstance.task = mockTask;
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show status label To Do for PENDING', () => {
    const fixture = TestBed.createComponent(TaskItemComponent);
    fixture.componentInstance.task = { ...mockTask, status: 'PENDING' };
    fixture.detectChanges();
    expect(fixture.componentInstance.statusLabel()).toBe('To Do');
  });

  it('should show status label Done for COMPLETED', () => {
    const fixture = TestBed.createComponent(TaskItemComponent);
    fixture.componentInstance.task = { ...mockTask, status: 'COMPLETED' };
    fixture.detectChanges();
    expect(fixture.componentInstance.statusLabel()).toBe('Done');
    expect(fixture.componentInstance.completed()).toBe(true);
  });

  it('should emit toggle when checkbox is toggled', () => {
    const fixture = TestBed.createComponent(TaskItemComponent);
    fixture.componentInstance.task = mockTask;
    fixture.detectChanges();
    let emitted = false;
    fixture.componentInstance.toggle.subscribe(() => (emitted = true));
    fixture.componentInstance.toggle.emit();
    expect(emitted).toBe(true);
  });
});
