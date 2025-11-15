import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistorialInventarioRoutingModule } from './historial-inventario-routing-module';
import { HistorialIndex } from './historial-index/historial-index';


@NgModule({
  declarations: [
    HistorialIndex
  ],
  imports: [
    CommonModule,
    HistorialInventarioRoutingModule
  ]
})
export class HistorialInventarioModule { }
