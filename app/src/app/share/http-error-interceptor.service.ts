import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from './notification-service';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorInterceptorService implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const noti = this.injector.get(NotificationService);
        let message: string | null = null;

        if (error.error instanceof ErrorEvent) {
          console.log('Error del Lado del Cliente');
          message = `Error: ${error.error.message}`;
        } else {
          console.log('Error del Lado del Servidor');
          message = `Código: ${error.status},  Mensaje: ${error.message}`;
          console.log(message);

          switch (error.status) {
            case 0:
              message = 'Error desconocido';
              break;
            case 400:
              message = 'Solicitud incorrecta';
              break;
            case 401:
              message = 'No autorizado';
              break;
            case 403:
              message = 'Acceso denegado';
              break;
            case 404:
              message = 'Recurso no encontrado';
              break;
            case 422:
              message = 'Se ha presentado un error';
              break;
            case 500:
              message = 'Error interno del servidor';
              break;
            case 503:
              message = 'Servicio no disponible';
              break;
          }
        }

        noti.error('Error ' + error.status, message, 5000);
        return throwError(() => error);
      })
    );
  }
}
