import { Routes } from '@angular/router';
import { LoginComponent } from './todo-app/pages/login/login';
import { UserTodos } from './todo-app/pages/user-todos/user-todos';
import { authGuard } from './todo-app/shared/auth.guard';
import { RegisterComponent } from './todo-app/pages/register/register';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'tasks', 
    component: UserTodos, 
    canActivate: [authGuard]
},
{path: 'register', component: RegisterComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];