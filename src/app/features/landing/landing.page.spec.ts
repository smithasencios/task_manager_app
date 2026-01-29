import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { LandingPage } from './landing.page';
import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import type { Observable } from 'rxjs';
import type { Task } from '../../core/models/task.model';

describe('LandingPage', () => {
  let taskService: {
    getAll: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    taskCreated$: Observable<void>;
    taskUpdated$: Observable<void>;
  };
  let authService: { user: ReturnType<typeof signal> };

  const mockTask: Task = {
    id: '1',
    title: 'Test',
    description: 'Desc',
    status: 'PENDING',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  beforeEach(async () => {
    const taskSpy = {
      getAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      taskCreated$: of(undefined),
      taskUpdated$: of(undefined),
    };
    taskSpy.getAll.mockReturnValue(of([mockTask]));

    const userSignal = signal<{ email?: string; displayName?: string } | null>({
      email: 'test@example.com',
      displayName: undefined,
    });
    authService = { user: userSignal };

    await TestBed.configureTestingModule({
      imports: [LandingPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations(),
        { provide: TaskService, useValue: taskSpy },
        { provide: AuthService, useValue: authService },
        { provide: MatDialog, useValue: { open: vi.fn() } },
      ],
    }).compileComponents();
    taskService = taskSpy;
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LandingPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should load tasks on init', () => {
    const fixture = TestBed.createComponent(LandingPage);
    fixture.detectChanges();
    expect(taskService.getAll).toHaveBeenCalled();
    expect(fixture.componentInstance.tasks().length).toBe(1);
    expect(fixture.componentInstance.tasks()[0].title).toBe('Test');
  });

  it('should display assignee from auth user', () => {
    const fixture = TestBed.createComponent(LandingPage);
    fixture.detectChanges();
    expect(fixture.componentInstance.assigneeName()).toBe('test');
    expect(fixture.componentInstance.assigneeInitials()).toBe('TE');
  });
});
