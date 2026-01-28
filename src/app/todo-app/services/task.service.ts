import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Task } from '../interfaces/tarea.interface';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7237/api/tasks';

  tasks = signal<Task[]>([]);

  async loadTasks() {
    const data = await firstValueFrom(this.http.get<Task[]>(this.apiUrl));
    this.tasks.set(data);
  }

  async create(title: string, priority: string) {
    const newTask = await firstValueFrom(this.http.post<Task>(this.apiUrl, { title, priority }));
    this.tasks.update(prev => [...prev, newTask]);
  }

  async update(task: Task) {
    await firstValueFrom(this.http.put(`${this.apiUrl}/${task.id}`, task));
    this.tasks.update(prev => prev.map(t => t.id === task.id ? task : t));
  }

  async delete(id: number) {
    await firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    this.tasks.update(prev => prev.filter(t => t.id !== id));
  }
}