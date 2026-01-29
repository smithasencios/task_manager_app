import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TaskService } from './task.service';
import type { CreateTaskDto } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll should return tasks sorted by createdAt', () => {
    const mock = [
      {
        id: '2',
        title: 'B',
        description: 'Desc B',
        status: 'PENDING',
        createdAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      },
      {
        id: '1',
        title: 'A',
        description: 'Desc A',
        status: 'PENDING',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ];
    service.getAll().subscribe((tasks) => {
      expect(tasks.length).toBe(2);
      expect(tasks[0].id).toBe('1');
      expect(tasks[1].id).toBe('2');
    });
    const req = httpMock.expectOne((r) =>
      r.url.includes('/tasks') && r.method === 'GET'
    );
    req.flush(mock);
  });

  it('create should POST and return task', () => {
    const dto: CreateTaskDto = { title: 'T', description: 'D' };
    const created = {
      id: '1',
      ...dto,
      status: 'PENDING',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };
    service.create(dto).subscribe((t) => {
      expect(t.id).toBe('1');
      expect(t.title).toBe('T');
    });
    const req = httpMock.expectOne((r) =>
      r.url.includes('/tasks') && r.method === 'POST'
    );
    expect(req.request.body).toEqual(dto);
    req.flush(created);
  });

  it('create should emit taskCreated$ on success', () => {
    const dto: CreateTaskDto = { title: 'T', description: 'D' };
    const created = {
      id: '1',
      ...dto,
      status: 'PENDING',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };
    let emitted = false;
    service.taskCreated$.subscribe(() => (emitted = true));
    service.create(dto).subscribe();
    const req = httpMock.expectOne((r) =>
      r.url.includes('/tasks') && r.method === 'POST'
    );
    req.flush(created);
    expect(emitted).toBe(true);
  });

  it('update should PUT and emit taskUpdated$ on success', () => {
    const dto = { title: 'Updated', description: 'Desc' };
    let emitted = false;
    service.taskUpdated$.subscribe(() => (emitted = true));
    service.update('1', dto).subscribe();
    const req = httpMock.expectOne((r) =>
      r.url.includes('/tasks/1') && r.method === 'PUT'
    );
    expect(req.request.body).toEqual(dto);
    req.flush(null);
    expect(emitted).toBe(true);
  });

  it('delete should DELETE', () => {
    service.delete('1').subscribe();
    const req = httpMock.expectOne((r) =>
      r.url.includes('/tasks/1') && r.method === 'DELETE'
    );
    req.flush(null);
  });
});
