import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventarioIndex } from './screens/inventario-index/inventario-index';
import { InventarioForm } from './screens/inventario-form/inventario-form';

const routes: Routes = [
  {
    path: '',
    component: InventarioIndex
  },
  {
    path: 'create',
    component: InventarioForm
  },
  {
    path: 'update/:id',
    component: InventarioForm
  },
  


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventarioRoutingModule { }
