import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Task } from '../../interfaces/tarea.interface';

@Component({
  selector: 'app-user-todos',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-todos.html',
})
export class UserTodos implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  public authService = inject(AuthService);

  tasks = this.taskService.tasks;

  totalTasks = computed(() => this.tasks().length);
  completedTasks = computed(() => this.tasks().filter(t => t.completed).length);

  taskForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    priority: ['Media', [Validators.required]]
  });

  ngOnInit(): void {
    this.loadInitialData();
  }

  async loadInitialData() {
    try {
      await this.taskService.loadTasks();
    } catch (error) {
      console.error('Error al cargar tareas iniciales:', error);
    }
  }

  async addTask() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const { title, priority } = this.taskForm.getRawValue();
    
    try {
      await this.taskService.create(title, priority);
      this.taskForm.reset({ priority: 'Media' });
    } catch (error) {
      console.error('Error al añadir tarea:', error);
    }
  }

  async toggleTask(id: number) {
    const task = this.tasks().find(t => t.id === id);
    if (!task) return;

    const updatedTask: Task = { ...task, completed: !task.completed };
    
    try {
      await this.taskService.update(updatedTask);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  }

  async deleteTask(id: number) {
    try {
      await this.taskService.delete(id);
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  }

  onLogout() {
    this.authService.logout();
  }
}