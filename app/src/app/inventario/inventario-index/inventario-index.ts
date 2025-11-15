// src/app/inventario/inventario-index/inventario-index.ts
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { InventarioModel } from '../../share/models/inventarioModel';
import { EEstado } from '../../share/models/estadoModel';
import { ECategoria } from '../../share/models/categoriaModel';

import { InventarioService } from '../../share/services/inventario.service';
import { InventarioForm } from '../inventario-form/inventario-form';

@Component({
  selector: 'app-inventario-index',
  templateUrl: './inventario-index.html',
  standalone: false,
  styleUrls: ['./inventario-index.css'],
})
export class InventarioIndex implements OnInit {
  displayedColumns: string[] = ['Nombre', 'stock', 'estado', 'createdAt', 'updatedAt', 'acciones'];

  dataSource = new MatTableDataSource<InventarioModel>([]);
  cargando = false;
  error: string | null = null;
  terminoBusqueda = '';

  mostrarForm = false;
  modoForm: 'crear' | 'editar' = 'crear';
  inventarioSeleccionado: InventarioModel | null = null;

  constructor(private inventarioService: InventarioService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.cargarInventario();
  }

  cargarInventario(): void {
    this.cargando = true;
    this.error = null;

    this.inventarioService.get().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Ocurrió un error al cargar el inventario.';
        this.cargando = false;
      },
    });
  }

  obtenerClaseStock(stock: number): string {
    if (stock <= 5) return 'stock-critico';
    if (stock <= 10) return 'stock-bajo';
    return 'stock-ok';
  }


  trackById(index: number, item: InventarioModel): number | undefined {
    return item.id;
  }

  abrirFormCrear(): void {
    this.modoForm = 'crear';
    this.inventarioSeleccionado = null;
    this.mostrarForm = true;
  }

  // 🔹 Abrir en modo EDITAR
  abrirFormEditar(item: InventarioModel): void {
    this.modoForm = 'editar';
    this.inventarioSeleccionado = item;
    console.log(this.inventarioSeleccionado);
    this.mostrarForm = true;
  }

  // 🔹 Cerrar form (recargar si se guardó)
  onCerrarForm(recargar: boolean): void {
    this.mostrarForm = false;
    this.inventarioSeleccionado = null;

    if (recargar) {
      this.cargarInventario();
    }
  }
}
