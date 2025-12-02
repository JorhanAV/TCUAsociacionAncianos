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

  // Iconos actualizados para dar mejor contexto
  items: NavItem[] = [
    { icon: 'dashboard', label: 'Inicio', path: '/inicio' }, // Dashboard es más pro que Home
    { icon: 'groups', label: 'Perfiles', path: '/perfiles' }, // Groups para comunidad
    { icon: 'inventory_2', label: 'Inventario', path: '/inventario' }, // Icono caja
    { icon: 'event', label: 'Actividades', path: '/actividades' }, // Agregado basado en doc
    { icon: 'contact_mail', label: 'Contacto', path: '/contacto' },
  { icon: 'bar_chart', label: 'Dashboard', path: '/dashboard' },
    { icon: 'settings', label: 'Configuración', path: '/configuracion' },
  ];
}