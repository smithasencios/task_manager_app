import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../../core/services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import type { Task, UpdateTaskDto } from '../../../core/models/task.model';

export interface EditTaskDialogData {
  task: Task;
}

@Component({
  selector: 'app-edit-task-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './edit-task-dialog.component.html',
  styleUrl: './edit-task-dialog.component.scss',
})
export class EditTaskDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<EditTaskDialogComponent>);
  private readonly data = inject<EditTaskDialogData>(MAT_DIALOG_DATA);
  private readonly taskService = inject(TaskService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  readonly task = this.data.task;
  readonly submitting = signal(false);

  readonly form = this.fb.nonNullable.group({
    title: [this.task.title, [Validators.required, Validators.maxLength(200)]],
    description: [this.task.description, [Validators.required, Validators.maxLength(2000)]],
  });

  cancel(): void {
    this.dialogRef.close(false);
  }

  submit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const dto: UpdateTaskDto = this.form.getRawValue();
    this.taskService.update(this.task.id, dto).subscribe({
      next: () => {
        this.dialogRef.close(true);
        this.snackBar.open('Task updated successfully', '', {
          duration: 3000,
          panelClass: ['create-task-success-snackbar'],
          horizontalPosition: 'start',
          verticalPosition: 'bottom',
        });
      },
      error: () => this.submitting.set(false),
      complete: () => this.submitting.set(false),
    });
  }
}
