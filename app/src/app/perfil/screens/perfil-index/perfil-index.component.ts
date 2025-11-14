import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { PerfilService } from '../../../share/services/perfil.service';
import { PerfilModel, ERol, EEstado } from '../../../share/models/PerfilModel';

@Component({
  selector: 'app-perfil-index',
  templateUrl: './perfil-index.component.html',
  styleUrl: './perfil-index.component.scss',
  standalone: false
})
export class PerfilIndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // inyección
  private fb = inject(FormBuilder);
  private svc = inject(PerfilService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  loading = signal(false);
  items = signal<PerfilModel[]>([]);
  pagina = signal(1);
  limite = signal(8);
  total = signal(0);
  paginas = signal(0);

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
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.pagina.set(1);
        this.load();
      });
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
          console.log('Respuesta perfiles:', res);

          let items: PerfilModel[] = [];
          let total = 0;
          let paginas = 1;

          if (Array.isArray(res)) {
            // caso: backend devuelve PerfilModel[]
            items = res;
            total = res.length;
            paginas = Math.max(1, Math.ceil(total / this.limite()));
          } else {
            // caso: backend devuelve objeto paginado
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

  toggleEstado(item: PerfilModel) {
    const nuevo = item.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    this.svc.setEstado(Number(item.id), nuevo as EEstado).subscribe(() => this.load());
  }

  crear() {
    this.router.navigate(['./nuevo']);
  }

  editar(it: PerfilModel) {
    this.router.navigate([`./${it.id}/editar`]);
  }

  eliminar(it: PerfilModel) {
    // aquí enchufas tu ConfirmDeleteDialog cuando lo tengas finito
    console.warn('TODO: implementar diálogo de confirmación y delete()');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
