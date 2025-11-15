import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistorialIndex } from './historial-index/historial-index';

const routes: Routes = [

  {
    path: '',
    component: HistorialIndex
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistorialInventarioRoutingModule { }
