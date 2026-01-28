export interface Task {
  id: number;
  title: string;
  priority: 'Baja' | 'Media' | 'Alta';
  completed: boolean;
}