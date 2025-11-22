// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { App } from './app';
import { MaterialModule } from './share/material.module';
import { CoreModule } from './core/core-module';
import { AppRoutingModule } from './app-routing-module';
import { HttpClientModule } from '@angular/common/http';
import { ActividadModule } from './actividad/actividad-module';

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,
    MaterialModule,
    CoreModule,
    AppRoutingModule,
    HttpClientModule,
    ActividadModule,
  ],
  bootstrap: [App],
})
export class AppModule {}
