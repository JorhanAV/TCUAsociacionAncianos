import { Component, EventEmitter, Output } from '@angular/core';

interface NavItem { icon: string; label: string; path: string; }

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  standalone: false
})
export class SidenavComponent {
  @Output() navigate = new EventEmitter<void>();

  items: NavItem[] = [
    { icon:'person',           label:'Perfil',          path:'/perfiles' },
    { icon:'receipt',          label:'Planes',          path:'/planes' },
    { icon:'groups',           label:'Clientes',        path:'/inicio' }, // ajusta si tienes /clientes
    { icon:'fitness_center',   label:'Rutinas',         path:'/rutinas' },
    { icon:'restaurant',       label:'Platillos',       path:'/platillos' },
    { icon:'sports_kabaddi',   label:'Ejercicios',      path:'/ejercicios' },
    { icon:'mail',             label:'Invitaciones',    path:'/invitaciones' },
    { icon:'timer',            label:'Entrenamientos',  path:'/entrenamientos' },
    { icon:'settings',         label:'Configuración',   path:'/configuracion' },
  ];
}
