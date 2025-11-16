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

  // 🔎 Filtro de texto
  terminoBusqueda = '';

  // 🎯 Filtros adicionales
  filtroMovimiento: 'TODOS' | 'ADD' | 'DELETE' = 'TODOS';
  filtroUsuario: 'TODOS' | string = 'TODOS';
  usuariosDisponibles: string[] = [];

  constructor(private historialService: HistorialInventarioService) {}

  ngOnInit(): void {
    this.configurarFiltroTabla();
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.cargando = true;
    this.error = null;

    this.historialService.get().subscribe({
      next: (data) => {
        const ordenado = [...data].sort(
          (a, b) =>
            new Date(b.fecha as any).getTime() -
            new Date(a.fecha as any).getTime()
        );

        this.dataSource.data = ordenado;
        this.actualizarUsuariosDisponibles(ordenado);
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Ocurrió un error al cargar el historial.';
        this.cargando = false;
      },
    });
  }

  private actualizarUsuariosDisponibles(
    data: HistorialInventarioModel[]
  ): void {
    const set = new Set<string>();
    for (const item of data) {
      const nombre = item.usuario?.nombre_usuario;
      if (nombre) set.add(nombre);
    }
    this.usuariosDisponibles = Array.from(set).sort((a, b) =>
      a.localeCompare(b)
    );
  }

  private configurarFiltroTabla(): void {
    this.dataSource.filterPredicate = (
      item: HistorialInventarioModel,
      filtroJson: string
    ) => {
      if (!filtroJson) return true;

      const filtro = JSON.parse(filtroJson) as {
        termino: string;
        movimiento: 'TODOS' | 'ADD' | 'DELETE';
        usuario: 'TODOS' | string;
      };

      const term = filtro.termino.trim().toLowerCase();

      // 🔎 Texto: producto, descripción, usuario, tipo
      const coincideTexto =
        !term ||
        (item.inventario?.Nombre || '').toLowerCase().includes(term) ||
        (item.descripcion || '').toLowerCase().includes(term) ||
        (item.usuario?.nombre_usuario || '').toLowerCase().includes(term) ||
        (item.tipoMovimiento || '').toLowerCase().includes(term);

      // 🎯 Tipo de movimiento
      const coincideMovimiento =
        filtro.movimiento === 'TODOS' ||
        item.tipoMovimiento === filtro.movimiento;

      // 🎯 Usuario
      const coincideUsuario =
        filtro.usuario === 'TODOS' ||
        item.usuario?.nombre_usuario === filtro.usuario;

      return coincideTexto && coincideMovimiento && coincideUsuario;
    };
  }

  private aplicarFiltros(): void {
    const filtro = {
      termino: this.terminoBusqueda,
      movimiento: this.filtroMovimiento,
      usuario: this.filtroUsuario,
    };

    this.dataSource.filter = JSON.stringify(filtro);
  }

  // Eventos desde la UI
  onBuscar(valor: string): void {
    this.terminoBusqueda = valor;
    this.aplicarFiltros();
  }

  onCambiarMovimiento(valor: 'TODOS' | 'ADD' | 'DELETE'): void {
    this.filtroMovimiento = valor;
    this.aplicarFiltros();
  }

  onCambiarUsuario(valor: 'TODOS' | string): void {
    this.filtroUsuario = valor;
    this.aplicarFiltros();
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
