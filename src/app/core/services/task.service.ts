import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Task, CreateTaskDto, UpdateTaskDto } from '../models/task.model';

const BASE = `${environment.apiBaseUrl}/tasks`;

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly taskCreated = new Subject<void>();
  private readonly taskUpdated = new Subject<void>();

  /** Emits when a task is created (e.g. from the create dialog). Subscribe to refresh the list. */
  readonly taskCreated$ = this.taskCreated.asObservable();
  /** Emits when a task is updated (e.g. from the edit dialog). Subscribe to refresh the list. */
  readonly taskUpdated$ = this.taskUpdated.asObservable();

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(BASE).pipe(
      map((list) =>
        [...list].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      )
    );
  }

  create(dto: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(BASE, dto).pipe(
      tap(() => this.taskCreated.next())
    );
  }

  update(id: string, dto: UpdateTaskDto): Observable<void> {
    return this.http.put<void>(`${BASE}/${id}`, dto).pipe(
      tap(() => this.taskUpdated.next())
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE}/${id}`);
  }
}
