import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'confirm-delete-dialog',
  template: `
  <h2 mat-dialog-title>{{ data?.title || 'Confirmar' }}</h2>
  <mat-dialog-content>
    <p>{{ data?.message || '¿Confirmas la acción?' }}</p>
  </mat-dialog-content>
  <mat-dialog-actions align="end">
    <button mat-stroked-button (click)="ref.close(false)">Cancelar</button>
    <button mat-raised-button color="warn" (click)="ref.close(true)">Eliminar</button>
  </mat-dialog-actions>
  `,
  standalone:false
})
export class ConfirmDeleteDialog {
  constructor(
    public ref: MatDialogRef<ConfirmDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
