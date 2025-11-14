// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { App } from './app';
import { MaterialModule } from './share/material.module';
import { CoreModule } from './core/core-module';
import { AppRoutingModule } from './app-routing-module';
import { HomeModule } from './home/home-module';
import { HttpClientModule } from '@angular/common/http';
import { InventarioModule } from './inventario/inventario-module';

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,
    MaterialModule, 
    CoreModule, 
    HomeModule,
    InventarioModule, 
    AppRoutingModule, 
    HttpClientModule,
    
  ],
  bootstrap: [App]
})
export class AppModule {}
