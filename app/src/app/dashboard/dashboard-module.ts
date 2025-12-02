import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing-module';
import { MaterialModule } from '../share/material.module';
import { DashboardPageComponent } from './screens/dashboard-page/dashboard-page.component';



@NgModule({
  declarations: [
    DashboardPageComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule
  ]
})
export class DashboardModule { }