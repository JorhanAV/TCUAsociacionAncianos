import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActividadRoutingModule } from './actividad-routing-module';
import { ActividadIndex } from './screens/actividad-index/actividad-index';
import { ActividadDetail } from './screens/actividad-detail/actividad-detail';
import { ActividadForm } from './screens/actividad-form/actividad-form';
import { MaterialModule } from '../share/material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ActividadIndex,
    ActividadDetail,
    ActividadForm
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    ActividadRoutingModule
  ]
})
export class ActividadModule { }
