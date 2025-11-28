import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactoIndexComponent } from './screens/contacto-index/contacto-index.component';

const routes: Routes = [
  {
    path: '',
    component: ContactoIndexComponent,
    data: { title: 'Contacto' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactoRoutingModule {}
