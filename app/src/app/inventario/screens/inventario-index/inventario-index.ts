import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { InventarioModel } from '../../../share/models/inventarioModel';
import { InventarioService } from '../../../share/services/inventario.service';

@Component({
  selector: 'app-inventario-index',
  templateUrl: './inventario-index.html',
  standalone: false,
  styleUrls: ['./inventario-index.scss'], // O .scss si lo cambiaste
})
export class InventarioIndex implements OnInit {
  displayedColumns: string[] = ['Nombre', 'stock', 'estado', 'updatedAt', 'acciones']; // Ajusté columnas para que coincidan con el diseño limpio

  dataSource = new MatTableDataSource<InventarioModel>([]);
  cargando = false;
  error: string | null = null;

  mostrarForm = false;
  modoForm: 'crear' | 'editar' = 'crear';
  inventarioSeleccionado: InventarioModel | null = null;

  constructor(private inventarioService: InventarioService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.cargarInventario();
    
    // Configuración opcional: Define qué columnas usa el filtro (por defecto busca en todas)
    this.dataSource.filterPredicate = (data: InventarioModel, filter: string) => {
      const dataStr = (data.Nombre + data.descripcion + data.estado).toLowerCase();
      return dataStr.includes(filter);
    };
  }

  // 🔹 LÓGICA DE FILTRADO (Lo que faltaba)
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // 🔹 ESTADÍSTICAS (Para las tarjetas del Dashboard)
  get totalItems(): number {
    return this.dataSource.data.length;
  }

  get stockCritico(): number {
    // Cuenta cuántos productos tienen stock <= 5 (umbral crítico)
    return this.dataSource.data.filter(item => item.stock <= 5).length;
  }
  // ... (dentro de la clase InventarioIndex)

  get porcentajeDisponibilidad(): string {
    const total = this.totalItems;
    
    // Evitar división por cero si no hay datos aún
    if (total === 0) return '0';

    // Disponibilidad = (Items NO críticos / Total) * 100
    // Es decir, el porcentaje de productos que NO requieren atención urgente.
    const itemsSanos = total - this.stockCritico;
    const porcentaje = (itemsSanos / total) * 100;

    // Retornamos fijo a 0 decimales (ej: "95") o 1 decimal (ej: "95.5")
    return porcentaje.toFixed(0); 
  }

  // ... (resto del código)

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

  // Lógica visual para clases CSS
  obtenerClaseStock(stock: number): string {
    if (stock <= 5) return 'stock-critico';
    if (stock <= 10) return 'stock-bajo';
    return 'stock-ok';
  }

  trackById(index: number, item: InventarioModel): number | undefined {
    return item.id;
  }

  // 🔹 MODALES Y FORMULARIOS
  abrirFormCrear(): void {
    this.modoForm = 'crear';
    this.inventarioSeleccionado = null;
    this.mostrarForm = true;
  }

  abrirFormEditar(item: InventarioModel): void {
    this.modoForm = 'editar';
    // Clonamos el objeto para no modificar la tabla en tiempo real antes de guardar
    this.inventarioSeleccionado = { ...item }; 
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