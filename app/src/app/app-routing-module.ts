// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './core/layout/shell.component';
import { PageNotFound } from './share/page-not-found/page-not-found';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },

      // HOME (lazy)
      {
        path: '',
        loadChildren: () =>
          import('./home/home-module').then((m) => m.HomeModule),
      },

      // PERFILES (lazy)
      {
        path: 'perfiles',
        loadChildren: () =>
          import('./perfil/perfil-module').then((m) => m.PerfilModule),
        data: { title: 'Perfiles' },
      },
      
      // INVENTARIO (lazy)
      {
        path: 'inventario',
        loadChildren: () =>
          import('./inventario/inventario-module').then((m) => m.InventarioModule),
        data: { title: 'Inventario' },
      },
      
      // INVENTARIO-HISTORIAL (lazy)
       {
        path: 'inventario-historial',
        loadChildren: () =>
          import('./historial-inventario/historial-inventario-module')
            .then((m) => m.HistorialInventarioModule),
        data: { title: 'Historial inventario' },
      },
      
      // ACTIVIDADES (lazy)
      {
        path: 'actividades',
        loadChildren: () =>
          import('./actividad/actividad-module').then((m) => m.ActividadModule),
        data: { title: 'Actividades' },
      },

      {
  path: 'contacto',
  loadChildren: () =>
    import('./contacto/contacto-module').then((m) => m.ContactoModule),
  data: { title: 'Contacto' },
},

    ],
  },

  // ⚠️ EL WILDCARD SIEMPRE AL FINAL Y FUERA DEL CHILDREN
  { path: '**', component: PageNotFound },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
