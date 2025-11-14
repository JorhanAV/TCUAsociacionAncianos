// home/home.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../share/material.module';
import { HomeRoutingModule } from './home-routing-module';
import { InicioComponent } from './inicio/inicio.component';
// importa también tus otros componentes: AcercaDeComponent, ContactoComponent, etc.

@NgModule({
  declarations: [
    InicioComponent,
  ],
  imports: [CommonModule, RouterModule, MaterialModule, HomeRoutingModule],
})
export class HomeModule {}
