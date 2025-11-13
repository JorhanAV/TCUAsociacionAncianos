import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcercaDe } from './acerca-de/acerca-de';
import { InicioComponent } from './inicio/inicio.component';

const routes: Routes = [
  { path:'acercade',component: AcercaDe},  
  { path:'inicio',component: InicioComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
