import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventarioIndex } from './inventario-index/inventario-index';
import { InventarioForm } from './inventario-form/inventario-form';

const routes: Routes = [
  {
    path: 'inventario',
    component: InventarioIndex
  },
  {
    path: 'inventario/create',
    component: InventarioForm
  },
  {
    path: 'inventario/update/:id',
    component: InventarioForm
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventarioRoutingModule { }
