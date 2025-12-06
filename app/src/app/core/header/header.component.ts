// core/header/header.component.ts
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { AuthenticationService } from '../../share/authentication.service';

type NotiType = 'success' | 'warning' | 'info' | 'error';
interface Notificacion {
  id: number;
  texto: string;
  tipo: NotiType;
  leido: boolean;
}

@Component({
  selector: 'app-header',
  standalone: false, // lo mantenemos dentro del módulo
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Output() menuClick = new EventEmitter<void>();
  private auth = inject(AuthenticationService);

  // signal reactiva (en lugar de array mutable)
  notis = signal<Notificacion[]>([
    { id: 1, texto: 'Jose Soto renovó el plan Ultimate', tipo: 'success', leido: false },
    { id: 2, texto: 'Jose Soto depositó CRC 35000', tipo: 'success', leido: false },
    { id: 3, texto: 'tony soto aceptó invitación', tipo: 'info', leido: false },
    { id: 4, texto: 'tony soto es ahora un nuevo cliente', tipo: 'error', leido: true },
  ]);

  unreadCount = signal(0);

  constructor() {
    this.updateUnread();
  }

  private updateUnread() {
    const count = this.notis().filter((n) => !n.leido).length;
    this.unreadCount.set(count);
  }

  marcarTodasLeidas(event?: Event) {
    if (event) event.stopPropagation(); // Evita que el menú se cierre al hacer click

    this.notis.update((arr) => arr.map((n) => ({ ...n, leido: true })));
    this.updateUnread();
  }
  logout() {
    this.auth.logout();
  }
}
