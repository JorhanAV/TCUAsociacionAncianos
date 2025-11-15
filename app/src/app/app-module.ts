// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { App } from './app';
import { MaterialModule } from './share/material.module';
import { CoreModule } from './core/core-module';
import { AppRoutingModule } from './app-routing-module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,
    MaterialModule,
    CoreModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  bootstrap: [App],
})
export class AppModule {}
