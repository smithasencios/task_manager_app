import { Component, Input, Output, EventEmitter, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import {
  EditTaskDialogComponent,
  EditTaskDialogData,
} from '../edit-task-dialog/edit-task-dialog.component';
import type { Task } from '../../../core/models/task.model';

@Component({
  selector: 'tr[app-task-item]',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, MatButtonModule, MatIconModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
})
export class TaskItemComponent {
  private readonly dialog = inject(MatDialog);

  @Input({ required: true }) task!: Task;
  @Input() taskKey = 'TASK-1';
  @Input() assigneeName = 'Unassigned';
  @Input() assigneeInitials = '—';
  @Output() toggle = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  readonly completed = computed(() => this.task.status === 'COMPLETED');
  readonly statusLabel = computed(() => {
    const s = this.task.status;
    if (s === 'PENDING') return 'To Do';
    if (s === 'IN_PROGRESS') return 'In Progress';
    return 'Done';
  });
  readonly dueDateLabel = computed(() => {
    const d = this.task.updatedAt;
    return d ? new Date(d).toLocaleDateString(undefined, { dateStyle: 'short' }) : '—';
  });
  readonly priorityLabel = computed(() => 'Medium');

  openEditModal(): void {
    this.dialog.open<EditTaskDialogComponent, EditTaskDialogData>(EditTaskDialogComponent, {
      width: '520px',
      maxWidth: '95vw',
      disableClose: false,
      panelClass: 'create-task-dialog-panel',
      data: { task: this.task },
    });
  }
}
