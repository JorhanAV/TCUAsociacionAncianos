import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../share/material.module';
import { PerfilIndexComponent } from './screens/perfil-index/perfil-index.component';
import { ConfirmDeleteDialog } from '../share/confirm-delete.dialog';
import { PerfilFormComponent } from './screens/perfil-form/perfil-form.component';
import { PerfilRoutingModule } from './perfil-routing-module';

@NgModule({
  declarations: [
    PerfilIndexComponent,
    PerfilFormComponent,
    ConfirmDeleteDialog
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
    PerfilRoutingModule
  ]
})
export class PerfilModule {}
