import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../core/services/auth.service';
import { TaskService } from '../../core/services/task.service';
import { TaskItemComponent } from './task-item/task-item.component';
import { CreateTaskDialogComponent } from './create-task-dialog/create-task-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import type { Task } from '../../core/models/task.model';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatIconModule,
    TaskItemComponent,
  ],
  templateUrl: './landing.page.html',
  styleUrl: './landing.page.scss',
})
export class LandingPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly tasksService = inject(TaskService);
  private readonly dialog = inject(MatDialog);

  readonly tasks = signal<Task[]>([]);
  readonly loading = signal(false);

  readonly sortedTasks = computed(() => this.tasks());
  readonly assigneeName = computed(() => {
    const u = this.auth.user();
    if (!u) return 'Unassigned';
    return u.displayName || u.email?.split('@')[0] || 'User';
  });
  readonly assigneeInitials = computed(() => {
    const name = this.assigneeName();
    if (name === 'Unassigned') return '—';
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  });

  ngOnInit(): void {
    this.loadTasks();
    this.tasksService.taskCreated$.subscribe(() => this.loadTasks());
    this.tasksService.taskUpdated$.subscribe(() => this.loadTasks());
  }

  loadTasks(): void {
    this.loading.set(true);
    this.tasksService.getAll().subscribe({
      next: (list) => this.tasks.set(list),
      error: () => this.loading.set(false),
      complete: () => this.loading.set(false),
    });
  }

  openCreateModal(): void {
    this.dialog.open(CreateTaskDialogComponent, {
      width: '520px',
      disableClose: false,
      panelClass: 'create-task-dialog-panel',
    });
  }

  onToggle(task: Task): void {
    const status = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    this.tasksService.update(task.id, { status }).subscribe({
      next: () => this.loadTasks(),
    });
  }

  onDelete(task: Task): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'create-task-dialog-panel',
      data: {
        title: 'Delete task',
        message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        warn: true,
      },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.tasksService.delete(task.id).subscribe({
          next: () => this.loadTasks(),
        });
      }
    });
  }

  logout(): void {
    this.auth.logout().subscribe();
  }

  trackByTaskId(_: number, t: Task): string {
    return t.id;
  }
}
