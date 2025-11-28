import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFound } from './page-not-found/page-not-found';
import { MaterialModule } from './material.module';



@NgModule({
  declarations: [
    PageNotFound
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class ShareModule { }
