import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { InventarioModel } from '../../../share/models/inventarioModel';
import { EEstado } from '../../../share/models/estadoModel';
import { ECategoria } from '../../../share/models/categoriaModel';
import { InventarioService } from '../../../share/services/inventario.service';

@Component({
  selector: 'app-inventario-index',
  templateUrl: './inventario-index.html',
  standalone: false,
  styleUrls: ['./inventario-index.css'],
})
export class InventarioIndex implements OnInit {
  displayedColumns: string[] = [
    'Nombre',
    'stock',
    'estado',
    'createdAt',
    'updatedAt',
    'acciones',
  ];

  dataSource = new MatTableDataSource<InventarioModel>([]);
  cargando = false;
  error: string | null = null;

  // 🔎 Filtro de texto
  terminoBusqueda = '';

  // 🎯 Filtros adicionales
  filtroEstado: 'TODOS' | EEstado = 'TODOS';
  filtroCategoria: 'TODAS' | ECategoria = 'TODAS';
  filtroStock: 'TODOS' | 'CRITICO' | 'BAJO' | 'OK' = 'TODOS';

  // 🧩 para el modal de formulario (lo que ya tenías)
  mostrarForm = false;
  modoForm: 'crear' | 'editar' = 'crear';
  inventarioSeleccionado: InventarioModel | null = null;

  // enums a mano para el template
  estados = EEstado;
  categorias = ECategoria;

  constructor(private inventarioService: InventarioService) {}

  ngOnInit(): void {
    this.cargarInventario();
    this.configurarFiltroTabla();
  }

  cargarInventario(): void {
    this.cargando = true;
    this.error = null;

    this.inventarioService.get().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Ocurrió un error al cargar el inventario.';
        this.cargando = false;
      },
    });
  }

  // 📌 Configuramos el filterPredicate una sola vez
  configurarFiltroTabla(): void {
    this.dataSource.filterPredicate = (
      item: InventarioModel,
      filtroJson: string
    ) => {
      if (!filtroJson) return true;

      const filtro = JSON.parse(filtroJson) as {
        termino: string;
        estado: 'TODOS' | EEstado;
        categoria: 'TODAS' | ECategoria;
        stock: 'TODOS' | 'CRITICO' | 'BAJO' | 'OK';
      };

      const term = filtro.termino.trim().toLowerCase();

      // 🔎 filtro de texto: nombre, descripción, stock
      const coincideTexto =
        !term ||
        item.Nombre.toLowerCase().includes(term) ||
        (item.descripcion?.toLowerCase().includes(term) ?? false) ||
        String(item.stock).includes(term);

      // 🎯 filtro de estado
      const coincideEstado =
        filtro.estado === 'TODOS' || item.estado === filtro.estado;

      // 🎯 filtro de categoría
      const coincideCategoria =
        filtro.categoria === 'TODAS' ||
        item.idCategoria === filtro.categoria;

      // 🎯 filtro de nivel de stock
      let coincideStock = true;
      if (filtro.stock === 'CRITICO') {
        coincideStock = item.stock <= 5;
      } else if (filtro.stock === 'BAJO') {
        coincideStock = item.stock > 5 && item.stock <= 10;
      } else if (filtro.stock === 'OK') {
        coincideStock = item.stock > 10;
      }

      return coincideTexto && coincideEstado && coincideCategoria && coincideStock;
    };
  }

  // 🚀 Ejecutar filtros (se llama al cambiar cualquier filtro)
  aplicarFiltros(): void {
    const filtro = {
      termino: this.terminoBusqueda,
      estado: this.filtroEstado,
      categoria: this.filtroCategoria,
      stock: this.filtroStock,
    };

    // importante: Angular compara string, así que mandamos JSON
    this.dataSource.filter = JSON.stringify(filtro);
  }

  // Cambios desde el template
  onBuscar(valor: string): void {
    this.terminoBusqueda = valor;
    this.aplicarFiltros();
  }

  onCambiarEstado(valor: 'TODOS' | EEstado): void {
    this.filtroEstado = valor;
    this.aplicarFiltros();
  }

  onCambiarCategoria(valor: 'TODAS' | ECategoria): void {
    this.filtroCategoria = valor;
    this.aplicarFiltros();
  }

  onCambiarFiltroStock(valor: 'TODOS' | 'CRITICO' | 'BAJO' | 'OK'): void {
    this.filtroStock = valor;
    this.aplicarFiltros();
  }

  obtenerClaseStock(stock: number): string {
    if (stock <= 5) return 'stock-critico';
    if (stock <= 10) return 'stock-bajo';
    return 'stock-ok';
  }

  trackById(index: number, item: InventarioModel): number | undefined {
    return item.id;
  }

  // ✅ Modal form (lo que ya tenías)
  abrirFormCrear(): void {
    this.modoForm = 'crear';
    this.inventarioSeleccionado = null;
    this.mostrarForm = true;
  }

  abrirFormEditar(item: InventarioModel): void {
    this.modoForm = 'editar';
    this.inventarioSeleccionado = item;
    this.mostrarForm = true;
  }

  onCerrarForm(recargar: boolean): void {
    this.mostrarForm = false;
    this.inventarioSeleccionado = null;

    if (recargar) {
      this.cargarInventario();
    }
  }
}
