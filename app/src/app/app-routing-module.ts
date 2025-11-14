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
