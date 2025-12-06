// home/home.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../share/material.module';
import { HomeRoutingModule } from './home-routing-module';
import { InicioComponent } from './inicio/inicio.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActividadModule } from '../actividad/actividad-module';
// importa también tus otros componentes: AcercaDeComponent, ContactoComponent, etc.

@NgModule({
  declarations: [
    InicioComponent,
  ],
  imports: [CommonModule, RouterModule, MaterialModule, HomeRoutingModule, ReactiveFormsModule, ActividadModule],
})
export class HomeModule {}
