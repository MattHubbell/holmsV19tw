import { Routes } from '@angular/router';
import { authGuard } from './common/auth.guard';
import { LoginComponent } from './login/login.component';
import { ProtectedContentComponent } from './login/protected-content.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExampleComponent } from './example/example.component';
import { MemberComponent } from './example-database/member.component';
import { SetupComponent } from './setup/setup.component';
import { NewRegistrationComponent } from './new-registrations/new-registration.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'example',
    component: ExampleComponent,
  },
  {
    path: 'members',
    component: MemberComponent,
  },
  {
    path: 'new-registrations',
    component: NewRegistrationComponent,
    canActivate: [authGuard],
  },
  {
    path: 'setup',
    component: SetupComponent,
  },
  {
    path: 'protected-content',
    component: ProtectedContentComponent,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
