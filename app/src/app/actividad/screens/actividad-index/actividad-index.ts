import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { ActividadModel } from '../../../share/models/actividadModel';
import { ActividadService } from '../../../share/services/actividad.service';

@Component({
  selector: 'app-actividad-index',
  standalone: false,
  templateUrl: './actividad-index.html',
  styleUrls: ['./actividad-index.scss'],
})
export class ActividadIndex implements OnInit {
  displayedColumns: string[] = [
    'nombre',
    'fechaActividad',
    'horaInicio',
    'tipoActividad',
    'duracion',
    'acciones',
  ];

  // TAB INDEX
  tabIndex = 0;

  // DataSource para ambos tabs
  dataSourceTodas = new MatTableDataSource<ActividadModel>([]);
  dataSourceProximas = new MatTableDataSource<ActividadModel>([]);

  cargando = false;
  error: string | null = null;

  mostrarForm = false;
  modoForm: 'crear' | 'editar' = 'crear';
  actividadSeleccionada: ActividadModel | null = null;

  constructor(private actividadService: ActividadService) {}

  ngOnInit(): void {
    this.cargarActividades();

    // Filtro para el tab "Todas"
    this.dataSourceTodas.filterPredicate = (data: ActividadModel, filter: string) => {
      const dataStr = (
        data.nombre +
        data.tipoActividad +
        data.fechaActividad +
        data.horaInicio
      ).toLowerCase();
      return dataStr.includes(filter);
    };
  }

  cargarActividades(): void {
    this.cargando = true;
    this.error = null;

    this.actividadService.get().subscribe({
      next: (data) => {
        // Data completa
        this.dataSourceTodas.data = data;

        // Filtrar próximas actividades
        const ahora = new Date();

        const proximas = data.filter((a) => {
          const fechaHora = new Date(a.horaInicio);
          return fechaHora >= ahora;
        });

        this.dataSourceProximas.data = proximas;

        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Ocurrió un error al cargar las actividades.';
        this.cargando = false;
      },
    });
  }

  // Búsqueda solo afecta al TAB "Todas"
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceTodas.filter = filterValue.trim().toLowerCase();
  }

  // Estadísticas
  get totalActividades(): number {
    return this.dataSourceTodas.data.length;
  }

  get actividadesProximas(): number {
    return this.dataSourceProximas.data.length;
  }

  // Crear
  abrirFormCrear(): void {
    this.modoForm = 'crear';
    this.actividadSeleccionada = null;
    this.mostrarForm = true;
  }

  abrirFormEditar(item: ActividadModel) {
    this.modoForm = 'editar';

    this.actividadService.getById(item.id!).subscribe((data) => {
      this.actividadSeleccionada = data;
      this.mostrarForm = true;
    });
  }

  onCerrarForm(recargar: boolean) {
    this.mostrarForm = false;
    this.actividadSeleccionada = null;

    if (recargar) {
      this.cargarActividades();
    }
  }

  trackById(index: number, item: ActividadModel) {
    return item.id;
  }
}
