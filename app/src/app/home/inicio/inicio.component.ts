import { Component, OnInit, signal } from '@angular/core';
import { ActividadService } from '../../share/services/actividad.service';
import { ActividadModel } from '../../share/models/actividadModel';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  standalone: false,
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {

  // ---------- KPI señales ----------
  clientes = signal<any[]>([]);
  inventario = signal<any[]>([]);
  actividades = signal<ActividadModel[]>([]);

  // ---------- Calendario ----------
  diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre'];

  mesActual = new Date().getMonth();
  anioActual = new Date().getFullYear();
  calendario: any[] = [];

  // ---------- Modal ----------
  modalAbierto = false;
  actividadesDia: ActividadModel[] = [];
  diaSeleccionadoTexto = '';

  // ---------- Formulario ----------
  modoForm: 'crear' | 'editar' | null = null;
  actividadSeleccionada: ActividadModel | null = null;
  fechaSeleccionada!: Date;

  constructor(private actividadService: ActividadService) {}

  ngOnInit() {
    this.cargarActividades();
    this.generarCalendario();
  }

  // -----------------------------------------------------
  // KPI getters
  // -----------------------------------------------------
  cumpleanosHoy() { return 2; } // luego lo conectamos al backend
  stockBajo() { return 5; }
  actividadesProx() {
    const hoy = new Date();
    return this.actividades().filter(a => new Date(a.fechaActividad) >= hoy).length;
  }

  // -----------------------------------------------------
  // Cargar actividades desde backend
  // -----------------------------------------------------
  cargarActividades() {
    this.actividadService.get().subscribe((data) => {
      this.actividades.set(data);
      this.generarCalendario();
    });
  }

  // -----------------------------------------------------
  // Calendario
  // -----------------------------------------------------
  generarCalendario() {
    const inicioMes = new Date(this.anioActual, this.mesActual, 1);
    const finMes = new Date(this.anioActual, this.mesActual + 1, 0);

    const primerDia = inicioMes.getDay() || 7;
    const diasMes = finMes.getDate();

    const celdas = [];

    // Celdas vacías antes del día 1
    for (let i = 1; i < primerDia; i++) {
      celdas.push({ numero: null });
    }

    for (let d = 1; d <= diasMes; d++) {
      const fecha = new Date(this.anioActual, this.mesActual, d);

      const eventos = this.actividades().filter(
        (a) => new Date(a.fechaActividad).toDateString() === fecha.toDateString()
      );

      celdas.push({
        numero: d,
        fecha,
        eventos,
      });
    }

    this.calendario = celdas;
  }

  esHoy(f: any) {
    if (!f) return false;
    const hoy = new Date();
    return hoy.toDateString() === new Date(f).toDateString();
  }

  prevMonth() {
    this.mesActual--;
    if (this.mesActual < 0) {
      this.mesActual = 11;
      this.anioActual--;
    }
    this.generarCalendario();
  }

  nextMonth() {
    this.mesActual++;
    if (this.mesActual > 11) {
      this.mesActual = 0;
      this.anioActual++;
    }
    this.generarCalendario();
  }

  // -----------------------------------------------------
  // Modal
  // -----------------------------------------------------
  abrirDia(day: any) {
    if (!day.numero) return;

    this.fechaSeleccionada = day.fecha;

    this.actividadesDia = day.eventos;
    this.diaSeleccionadoTexto =
      day.numero + ' de ' + this.meses[this.mesActual];

    this.modalAbierto = true;
    this.modoForm = null;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.modoForm = null;
    this.actividadSeleccionada = null;
  }

  // -----------------------------------------------------
  // Crear / Editar Actividad
  // -----------------------------------------------------
  crearActividadNueva() {
    this.modoForm = 'crear';
    this.actividadSeleccionada = {
      fechaActividad: this.fechaSeleccionada.toISOString(),
    } as any;
  }

  editarActividad(ev: ActividadModel) {
    this.modoForm = 'editar';
    this.actividadSeleccionada = ev;
  }

  onCerrarActividad(recargar: boolean) {
    this.modoForm = null;

    if (recargar) {
      this.cargarActividades();
    }
  }
}
