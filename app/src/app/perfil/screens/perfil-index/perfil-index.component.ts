import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil, distinctUntilChanged } from 'rxjs';

import { PerfilService } from '../../../share/services/perfil.service';
import { perfilModel, ERol, EEstado } from '../../../share/models/perfilModel';
import { PerfilFormComponent } from '../perfil-form/perfil-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDeleteDialog } from '../../../share/confirm-delete.dialog';
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

  // LISTA ORIGINAL (sin filtros)
  allItems: perfilModel[] = [];

  // LISTA FILTRADA (lo que se muestra)
  items = signal<perfilModel[]>([]);

  private imageBaseUrl = environment.imageBaseUrl;

  filtros = this.fb.group({
    q: [''],
    rol: [''],
    estado: [''],
  });

  roles = Object.values(ERol);
  estados = Object.values(EEstado);

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.load();

    // BÚSQUEDA CON DEBOUNCE
    this.searchSubject
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe(() => this.applyFilters());
  }

  // INPUT DE BUSQUEDA
  onSearchInput(event: Event): void {
    this.searchSubject.next((event.target as HTMLInputElement).value);
  }

  // CARGA INICIAL (como Inventario)
  load(): void {
    this.loading.set(true);

    this.svc
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.allItems = res;
          this.applyFilters();
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error cargando perfiles', err);
          this.items.set([]);
          this.loading.set(false);
        },
      });
  }

  // FILTRADO LOCAL (100% instantáneo)
  applyFilters(): void {
  const q = (this.filtros.value.q ?? '').toLowerCase().trim();
  const rol = this.filtros.value.rol ?? '';
  const estado = this.filtros.value.estado ?? '';

  const filtrado = this.allItems.filter((p) => {

    const matchQ =
      p.nombre.toLowerCase().includes(q) ||
      (p.cedula ?? '').toLowerCase().includes(q);

    const matchRol = rol === '' || p.rol === rol;
    const matchEstado = estado === '' || p.estado === estado;

    return matchQ && matchRol && matchEstado;
  });

  this.items.set(filtrado);
}


  limpiarFiltros(): void {
    this.filtros.reset({ q: '', rol: '', estado: '' });
    this.applyFilters();
  }

  getFotoUrl(fileName: string | null | undefined): string {
    if (!fileName) return 'assets/images/default-avatar.png';
    return `${this.imageBaseUrl}${fileName}`;
  }

  toggleEstado(item: perfilModel) {
    const nuevo = item.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';

    this.svc.setEstado(Number(item.id), nuevo as EEstado).subscribe({
      next: () => {
        this.snackBar.open('Estado actualizado', 'OK', {
          duration: 2500,
        });
        this.load();
      },
    });
  }

  crear() {
    const ref = this.dialog.open(PerfilFormComponent, {
      width: '750px',
      maxHeight: '90vh',
      disableClose: true,
      data: { modo: 'crear', perfil: null },
    });

    ref.afterClosed().subscribe((x) => x && this.load());
  }

  editar(it: perfilModel) {
    const ref = this.dialog.open(PerfilFormComponent, {
      width: '750px',
      disableClose: true,
      data: { modo: 'editar', perfil: it },
    });

    ref.afterClosed().subscribe((x) => x && this.load());
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

    ref.afterClosed().subscribe((confirmado) => {
      if (!confirmado) return;

      this.svc.delete(it).subscribe(() => this.load());
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}