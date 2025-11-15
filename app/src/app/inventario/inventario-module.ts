import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventarioRoutingModule } from './inventario-routing-module';
import { InventarioIndex } from './inventario-index/inventario-index';
import { InventarioForm } from './inventario-form/inventario-form';
import { InventarioDetail } from './inventario-detail/inventario-detail';
import { MaterialModule } from "../share/material.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    InventarioIndex,
    InventarioForm,
    InventarioDetail
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InventarioRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MaterialModule
]
})
export class InventarioModule { }
