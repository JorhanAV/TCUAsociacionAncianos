import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing-module';
import { UserLogin } from './screens/user-login/user-login';
import { UserForm } from './screens/user-form/user-form';
import { UserPass } from './screens/user-pass/user-pass';
import { MaterialModule } from '../share/material.module';
import { UserAdmin } from './screens/user-admin/user-admin';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';


@NgModule({
  declarations: [
    UserLogin,
    UserForm,
    UserPass,
    UserAdmin
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    UserRoutingModule
  ]
})
export class UserModule { }
