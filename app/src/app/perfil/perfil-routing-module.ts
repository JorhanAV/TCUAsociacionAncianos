import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilIndexComponent } from './screens/perfil-index/perfil-index.component';
import { PerfilFormComponent } from './screens/perfil-form/perfil-form.component';

const routes: Routes = [
  { path: '', component: PerfilIndexComponent },
  { path: 'nuevo', component: PerfilFormComponent },
  { path: ':id/editar', component: PerfilFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilRoutingModule {}
