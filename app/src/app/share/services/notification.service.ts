import { Injectable, signal, computed } from '@angular/core';

type NotiType = 'success' | 'warning' | 'info' | 'error';

export interface Notificacion {
  id: number;
  texto: string;
  tipo: NotiType;
  leido: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {

  private notis = signal<Notificacion[]>([]);

  ultimas5 = computed(() =>
    this.notis()
      .slice()
      .sort((a, b) => b.id - a.id)
      .slice(0, 5)
  );

  unreadCount = computed(() =>
    this.notis().filter(n => !n.leido).length
  );

  agregar(texto: string, tipo: NotiType = 'info') {
    this.notis.update(arr => {
      const nextId = arr.length ? Math.max(...arr.map(n => n.id)) + 1 : 1;
      return [{ id: nextId, texto, tipo, leido: false }, ...arr];
    });
  }

  marcarTodas() {
    this.notis.update(arr => arr.map(n => ({ ...n, leido: true })));
  }

  getNotificaciones() {
    return this.notis;
  }
}