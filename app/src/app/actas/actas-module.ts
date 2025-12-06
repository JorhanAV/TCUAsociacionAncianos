import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../share/material.module';

import { ConfirmDeleteDialog } from '../share/confirm-delete.dialog';
import { ActasIndexComponent } from './screens/actas-index.component';
import { ActasRoutingModule } from './actas-routing-module';
import { SharedModule } from '../share/shared.module';

@NgModule({
  declarations: [
    ActasIndexComponent,     
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
    ActasRoutingModule,
    SharedModule
  ]
})
export class ActasModule {}
