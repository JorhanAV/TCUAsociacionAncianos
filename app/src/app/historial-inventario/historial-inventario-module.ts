import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistorialInventarioRoutingModule } from './historial-inventario-routing-module';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HistorialIndex } from './historial-index/historial-index';


@NgModule({
  declarations: [
    HistorialIndex
  ],
  imports: [
    CommonModule,
    HistorialInventarioRoutingModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule
  ]
})
export class HistorialInventarioModule { }
