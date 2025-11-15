// src/app/home/historial-inventario/historial-index/historial-index.ts
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { HistorialInventarioModel } from '../../share/models/historialInventarioModel';
import { EMovimientoInventario } from '../../share/models/movimientoInventarioModel';
import { HistorialInventarioService } from '../../share/services/historial-inventario.service';

@Component({
  selector: 'app-historial-index',
  templateUrl: './historial-index.html',
  standalone: false,
  styleUrls: ['./historial-index.css'],
})
export class HistorialIndex implements OnInit {
  displayedColumns: string[] = [
    'fecha',
    'producto',
    'descripcion',
    'tipoMovimiento',
    'usuario',
  ];

  dataSource = new MatTableDataSource<HistorialInventarioModel>([]);
  cargando = false;
  error: string | null = null;
  terminoBusqueda = '';

  constructor(private historialService: HistorialInventarioService) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.cargando = true;
    this.error = null;

    this.historialService.get().subscribe({
      next: (data) => {
        // si quieres ordenar del más reciente al más antiguo:
        this.dataSource.data = [...data].sort((a, b) => {
          return (
            new Date(b.fecha as any).getTime() -
            new Date(a.fecha as any).getTime()
          );
        });
        this.aplicarFiltro(this.terminoBusqueda);
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Ocurrió un error al cargar el historial.';
        this.cargando = false;
      },
    });
  }

  aplicarFiltro(valor: string): void {
    this.terminoBusqueda = valor;

    this.dataSource.filterPredicate = (
      item: HistorialInventarioModel,
      filter: string
    ) => {
      const term = filter.trim().toLowerCase();

      return (
        (item.inventario?.Nombre || '').toLowerCase().includes(term) ||
        (item.descripcion || '').toLowerCase().includes(term) ||
        (item.usuario?.nombre_usuario || '').toLowerCase().includes(term) ||
        (item.tipoMovimiento || '').toLowerCase().includes(term)
      );
    };

    this.dataSource.filter = valor.trim().toLowerCase();
  }

  getClaseMovimiento(tipo: EMovimientoInventario | string): string {
    return tipo === 'ADD' ? 'mov-add' : 'mov-del';
  }

  getLabelMovimiento(tipo: EMovimientoInventario | string): string {
    return tipo === 'ADD' ? 'Ingreso' : 'Salida';
  }

  trackById(index: number, item: HistorialInventarioModel): number | undefined {
    return item.id;
  }
}
