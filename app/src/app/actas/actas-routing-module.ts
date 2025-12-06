import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActasIndexComponent } from './screens/actas-index.component';

const routes: Routes = [
  { path: '', component: ActasIndexComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActasRoutingModule {}
