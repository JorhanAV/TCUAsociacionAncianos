import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactoRoutingModule } from './contacto-routing-module';
import { ContactoIndexComponent } from './screens/contacto-index/contacto-index.component';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from '../share/material.module';

@NgModule({
  declarations: [
    ContactoIndexComponent
  ],
  imports: [
    CommonModule,
    ContactoRoutingModule,

    // Requeridos para NO standalone
    MaterialModule
  ],
})
export class ContactoModule {}
