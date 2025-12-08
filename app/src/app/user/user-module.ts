import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing-module';
import { MaterialModule } from '../share/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserForm } from './screens/user-form/user-form';
import { UserAdmin } from './screens/user-admin/user-admin';
import { UserLogin } from './screens/user-login/user-login';
import { UserPass } from './screens/user-pass/user-pass';


@NgModule({
  declarations: [
    UserForm,
    UserAdmin,
    UserLogin,
    UserPass
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    MatDialogModule,
    UserRoutingModule
  ]
})
export class UserModule { }
