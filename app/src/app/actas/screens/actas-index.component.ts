import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil, distinctUntilChanged } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { ActasService } from '../../share/services/actas.service';
import { ActaModel } from '../../share/models/actaModel';
import { ConfirmDeleteDialog } from '../../share/confirm-delete.dialog';

@Component({
  selector: 'app-actas-index',
  templateUrl: './actas-index.component.html',
  styleUrl: './actas-index.component.scss',
  standalone: false,
})
export class ActasIndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private fb = inject(FormBuilder);
  private svc = inject(ActasService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  loading = signal(false);

  allItems: ActaModel[] = [];
  items = signal<ActaModel[]>([]);

  filtros = this.fb.group({
    q: [''],
  });

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.load();

    this.searchSubject
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe(() => this.applyFilters());
  }

  onSearchInput(event: Event): void {
    this.searchSubject.next((event.target as HTMLInputElement).value);
  }

  load(): void {
    this.loading.set(true);

    this.svc.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.allItems = res;
          this.applyFilters();
          this.loading.set(false);
        },
        error: () => {
          this.items.set([]);
          this.loading.set(false);
        }
      });
  }

  applyFilters(): void {
    const q = (this.filtros.value.q ?? '').toLowerCase().trim();

    const filtrado = this.allItems.filter(a =>
      a.URL.toLowerCase().includes(q) ||
      String(a.idUsuario).includes(q)
    );

    this.items.set(filtrado);
  }

  limpiarFiltros(): void {
    this.filtros.reset({ q: '' });
    this.applyFilters();
  }

  verActa(a: ActaModel) {
    const url = this.svc.getActaUrl(a.URL);
    window.open(url, "_blank");
  }

  crearActa() {
    // Simple: un input file directo
    const input = document.createElement('input');
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.xlsx";

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      // Reemplaza con el usuario actual si lo tienes
      const idUsuario = 1;

      this.svc.uploadActa(file, idUsuario).subscribe({
        next: () => {
          this.snack.open("Acta cargada correctamente", "OK", { duration: 2500 });
          this.load();
        }
      });
    };

    input.click();
  }

  eliminar(a: ActaModel) {
    const ref = this.dialog.open(ConfirmDeleteDialog, {
      width: "400px",
      disableClose: true,
      data: {
        title: "Eliminar acta",
        message: `¿Seguro que deseas eliminar el acta #${a.id}?`,
      },
    });

    ref.afterClosed().subscribe(confirmado => {
      if (!confirmado) return;

      this.svc.delete(a.id).subscribe(() => this.load());
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
