import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDeleteDialog } from './confirm-delete.dialog';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    ConfirmDeleteDialog
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    ConfirmDeleteDialog
  ]
})
export class SharedModule {}
