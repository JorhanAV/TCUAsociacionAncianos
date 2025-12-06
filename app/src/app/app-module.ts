// app.module.ts
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { App } from './app';
import { MaterialModule } from './share/material.module';
import { CoreModule } from './core/core-module';
import { AppRoutingModule } from './app-routing-module';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ActividadModule } from './actividad/actividad-module';
import { HttpErrorInterceptorService } from './share/http-error-interceptor.service';
import { HttpAuthInterceptorService } from './share/http-auth-interceptor.service';

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,
    MaterialModule,
    CoreModule,
    AppRoutingModule,
    HttpClientModule,
    ActividadModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpAuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [App],
})
export class AppModule {}
