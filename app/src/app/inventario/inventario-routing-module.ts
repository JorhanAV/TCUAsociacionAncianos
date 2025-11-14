import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventarioIndex } from './inventario-index/inventario-index';

const routes: Routes = [
  {
    path: 'inventario',
    component: InventarioIndex
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventarioRoutingModule { }
