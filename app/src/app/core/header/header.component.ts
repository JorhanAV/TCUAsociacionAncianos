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

  notis = this.notif.ultimas5;
  unreadCount = this.notif.unreadCount;

  marcarTodasLeidas() {
    this.notif.marcarTodas();
  }
}
