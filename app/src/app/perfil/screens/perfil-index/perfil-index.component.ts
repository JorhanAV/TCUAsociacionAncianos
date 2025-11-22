import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { PerfilService } from '../../../share/services/perfil.service';
import { perfilModel, ERol, EEstado } from '../../../share/models/perfilModel';
import { PerfilFormComponent } from '../perfil-form/perfil-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDeleteDialog } from '../../../share/confirm-delete.dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-perfil-index',
  templateUrl: './perfil-index.component.html',
  styleUrl: './perfil-index.component.scss',
  standalone: false,
})
export class PerfilIndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private fb = inject(FormBuilder);
  private svc = inject(PerfilService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  loading = signal(false);
  items = signal<perfilModel[]>([]);
  pagina = signal(1);
  limite = signal(8);
  total = signal(0);
  paginas = signal(0);

  private imageBaseUrl = environment.imageBaseUrl; 

  filtros = this.fb.group({
    q: [''],
    rol: ['' as ERol | ''],
    estado: ['' as EEstado | ''],
  });

  roles = Object.values(ERol);
  estados = Object.values(EEstado);

  ngOnInit(): void {
    this.load();

    this.filtros.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500), // <--- Espera 500ms a que el usuario termine de escribir
        distinctUntilChanged() // <--- Evita recargar si el valor es el mismo
      )
      .subscribe(() => {
        this.pagina.set(1);
        this.load();
      });
  }


    getFotoUrl(fileName: string | null | undefined): string {
      if (!fileName) {
        // Devuelve una imagen placeholder si no hay foto
        return 'assets/images/default-avatar.png'; 
      }
      return `${this.imageBaseUrl}${fileName}`;
    }
  load(): void {
    this.loading.set(true);
    const { q, rol, estado } = this.filtros.value;

    this.svc
      .listPaged({
        pagina: this.pagina(),
        limite: this.limite(),
        q: q ?? '',
        rol: (rol ?? '') as any,
        estado: (estado ?? '') as any,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          let items: perfilModel[] = [];
          let total = 0;
          let paginas = 1;

          if (Array.isArray(res)) {
            items = res;
            total = res.length;
            paginas = Math.max(1, Math.ceil(total / this.limite()));
          } else {
            items = res.items ?? [];
            total = res.total ?? items.length;
            paginas = res.paginas ?? Math.max(1, Math.ceil(total / this.limite()));
          }

          this.items.set(items);
          this.total.set(total);
          this.paginas.set(paginas);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error cargando perfiles', err);
          this.items.set([]);
          this.total.set(0);
          this.paginas.set(1);
          this.loading.set(false);
        },
      });
  }

  nextPage() {
    if (this.pagina() < this.paginas()) {
      this.pagina.update((p) => p + 1);
      this.load();
    }
  }

  prevPage() {
    if (this.pagina() > 1) {
      this.pagina.update((p) => p - 1);
      this.load();
    }
  }
  limpiarFiltros() {
    this.filtros.reset();
  }
  toggleEstado(item: perfilModel) {
    const nuevo = item.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    this.svc.setEstado(Number(item.id), nuevo as EEstado).subscribe({
      next: () => {
        const msg =
          nuevo === 'ACTIVO'
            ? 'Perfil activado correctamente.'
            : 'Perfil desactivado correctamente.';
        this.snackBar.open(msg, 'OK', {
          duration: 2500,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
        this.load();
      },
      error: (err) => {
        console.error('Error cambiando estado', err);
        this.snackBar.open('Error al cambiar el estado del perfil.', 'Cerrar', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['snackbar-error'],
        });
      },
    });
  }
  // 🔹 CREAR en MatDialog
  crear() {
    const ref = this.dialog.open(PerfilFormComponent, {
      width: '750px', // ancho fijo
      maxHeight: '90vh', // alto máximo antes de scroll
      autoFocus: false,
      disableClose: true,
      data: {
        modo: 'crear',
        perfil: null,
      },
    });

    ref.afterClosed().subscribe((recargar: boolean) => {
      if (recargar) {
        this.load();
      }
    });
  }

  // 🔹 EDITAR en MatDialog
  editar(it: perfilModel) {
    const ref = this.dialog.open(PerfilFormComponent, {
      width: '750px',
      maxHeight: '100vh',
      autoFocus: false,
      disableClose: true,
      data: { modo: 'editar', perfil: it },
    });
    ref.afterClosed().subscribe((recargar: boolean) => {
      if (recargar) {
        this.load();
      }
    });
  }

  eliminar(it: perfilModel) {
    const ref = this.dialog.open(ConfirmDeleteDialog, {
      width: '400px',
      disableClose: true,
      data: {
        title: 'Eliminar perfil',
        message: `¿Seguro que deseas eliminar el perfil "${it.nombre}"?`,
      },
    });

    ref.afterClosed().subscribe((confirmado: boolean) => {
      if (!confirmado) {
        return;
      }

      this.svc.delete(it).subscribe({
        next: () => {
          this.snackBar.open('Perfil eliminado correctamente.', 'OK', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['snackbar-success'],
          });
          this.load(); // recargar listado
        },
        error: (err) => {
          console.error('Error eliminando perfil', err);
          this.snackBar.open('Error al eliminar el perfil.', 'Cerrar', {
            duration: 4000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['snackbar-error'],
          });
        },
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
