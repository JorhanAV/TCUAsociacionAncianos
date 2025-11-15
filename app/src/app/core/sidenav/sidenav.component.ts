import { Component, EventEmitter, Output } from '@angular/core';

interface NavItem {
  icon: string;
  label: string;
  path: string;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  standalone: false,
})
export class SidenavComponent {
  @Output() navigate = new EventEmitter<void>();

  items: NavItem[] = [
    { icon: 'home', label: 'Inicio', path: '/inicio' },
    { icon: 'person', label: 'Perfil', path: '/perfiles' },
    { icon: 'receipt', label: 'Inventario', path: '/inventario' },
    { icon: 'settings', label: 'Configuración', path: '/configuracion' },
  ];
}
