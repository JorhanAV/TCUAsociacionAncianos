// core/header/header.component.ts
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { AuthenticationService } from '../../share/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { UserPass } from '../../user/screens/user-pass/user-pass';
import { NotificationsService } from '../../share/services/notification.service';

type NotiType = 'success' | 'warning' | 'info' | 'error';
interface Notificacion {
  id: number;
  texto: string;
  tipo: NotiType;
  leido: boolean;
}

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
 

  notis = this.notif.ultimas5;
  unreadCount = this.notif.unreadCount;

  constructor(private dialog: MatDialog) {
  }
/* 
  private updateUnread() {
    const count = this.notis().filter((n) => !n.leido).length;
    this.unreadCount.set(count);
  } */

  marcarTodasLeidas() {
    this.notif.marcarTodas();
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
