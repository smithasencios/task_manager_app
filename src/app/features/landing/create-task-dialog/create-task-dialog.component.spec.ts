import { TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateTaskDialogComponent } from './create-task-dialog.component';
import { TaskService } from '../../../core/services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

describe('CreateTaskDialogComponent', () => {
  let dialogRef: { close: ReturnType<typeof vi.fn> };
  let taskService: { create: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    dialogRef = { close: vi.fn() };
    taskService = { create: vi.fn() };
    taskService.create.mockReturnValue(
      of({
        id: '1',
        title: 'New',
        description: 'Desc',
        status: 'PENDING',
        createdAt: '',
        updatedAt: '',
      })
    );

    await TestBed.configureTestingModule({
      imports: [CreateTaskDialogComponent],
      providers: [
        provideAnimations(),
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: TaskService, useValue: taskService },
        { provide: MatSnackBar, useValue: { open: vi.fn() } },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CreateTaskDialogComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should close with false on cancel', () => {
    const fixture = TestBed.createComponent(CreateTaskDialogComponent);
    fixture.detectChanges();
    fixture.componentInstance.cancel();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should not submit when form is invalid', () => {
    const fixture = TestBed.createComponent(CreateTaskDialogComponent);
    fixture.detectChanges();
    fixture.componentInstance.submit();
    expect(taskService.create).not.toHaveBeenCalled();
  });

  it('should call create and close with true when form is valid', () => {
    const fixture = TestBed.createComponent(CreateTaskDialogComponent);
    fixture.componentInstance.form.setValue({ title: 'New task', description: 'Description' });
    fixture.detectChanges();
    fixture.componentInstance.submit();
    expect(taskService.create).toHaveBeenCalledWith({ title: 'New task', description: 'Description' });
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});
