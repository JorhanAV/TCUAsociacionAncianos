import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActividadIndex } from './screens/actividad-index/actividad-index';

const routes: Routes = [
  {
      path: '',
      component: ActividadIndex
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActividadRoutingModule { }
