// core/header/header.component.ts
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { AuthenticationService } from '../../share/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { UserPass } from '../../user/screens/user-pass/user-pass';

type NotiType = 'success' | 'warning' | 'info' | 'error';
interface Notificacion {
  id: number;
  texto: string;
  tipo: NotiType;
  leido: boolean;
}

import { Component, EventEmitter, inject, Output } from '@angular/core';
import { NotificationsService } from '../../share/services/notification.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: false,
})
export class HeaderComponent {
  private notif = inject(NotificationsService);
  @Output() menuClick = new EventEmitter<void>();
  private auth = inject(AuthenticationService);
  isAuthenticated = this.auth.isAuthenticatedSignal;
  currentUser = this.auth.currentUserSignal;

  // signal reactiva (en lugar de array mutable)
  notis = signal<Notificacion[]>([
    { id: 1, texto: 'Jose Soto renovó el plan Ultimate', tipo: 'success', leido: false },
    { id: 2, texto: 'Jose Soto depositó CRC 35000', tipo: 'success', leido: false },
    { id: 3, texto: 'tony soto aceptó invitación', tipo: 'info', leido: false },
    { id: 4, texto: 'tony soto es ahora un nuevo cliente', tipo: 'error', leido: true },
  ]);

  unreadCount = signal(0);

  constructor(private dialog: MatDialog) {
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
  abrirCambioPass() {
    this.dialog.open(UserPass, {
      width: '470px',
      panelClass: 'blur-modal',
    });
  }
}
  notis = this.notif.ultimas5;
  unreadCount = this.notif.unreadCount;

  marcarTodasLeidas() {
    this.notif.marcarTodas();
  }
}
