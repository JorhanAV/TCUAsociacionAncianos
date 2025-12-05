import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing-module';
import { UserLogin } from './screens/user-login/user-login';
import { UserForm } from './screens/user-form/user-form';
import { UserPass } from './screens/user-pass/user-pass';


@NgModule({
  declarations: [
    UserLogin,
    UserForm,
    UserPass
  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
