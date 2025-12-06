import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLogin } from './screens/user-login/user-login';
import { UserForm } from './screens/user-form/user-form';
import { UserPass } from './screens/user-pass/user-pass';
import { UserAdmin } from './screens/user-admin/user-admin';

const routes: Routes = [
  { path: '', component: UserAdmin },
  { path: 'user-form', component: UserForm },
  { path: 'user-pass', component: UserPass },
  { path: 'user-login', component: UserLogin },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
