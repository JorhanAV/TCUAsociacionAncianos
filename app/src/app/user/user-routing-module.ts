import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAdmin } from './screens/user-admin/user-admin';
import { UserForm } from './screens/user-form/user-form';
import { UserLogin } from './screens/user-login/user-login';
import { UserPass } from './screens/user-pass/user-pass';
import { authGuard } from '../share/auth.guard';

const routes: Routes = [
  { path: '', component: UserAdmin },
  { path: 'user-form', component: UserForm },
  { path: 'user-login', component: UserLogin },
  { path: 'user-pass', component: UserPass },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
