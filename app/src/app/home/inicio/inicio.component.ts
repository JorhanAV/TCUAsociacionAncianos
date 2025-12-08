import { Component, OnInit, signal } from '@angular/core';
import { ActividadService } from '../../share/services/actividad.service';
import { ActividadModel } from '../../share/models/actividadModel';
import { PerfilService } from '../../share/services/perfil.service';
import { InventarioService } from '../../share/services/inventario.service';

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
  meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Setiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  mesActual = new Date().getMonth();
  anioActual = new Date().getFullYear();
  calendario: any[] = [];

  // ---------- Modal ----------
  modalAbierto = false;
  actividadesDia: ActividadModel[] = [];
  diaSeleccionadoTexto = '';
  cumpleanosDia: any[] = [];
  actividadesHoy: ActividadModel[] = [];

  // ---------- Formulario ----------
  modoForm: 'crear' | 'editar' | null = null;
  actividadSeleccionada: ActividadModel | null = null;
  fechaSeleccionada!: Date;

  constructor(
    private actividadService: ActividadService,
    private perfilService: PerfilService,
    private inventarioService: InventarioService
  ) {}

  ngOnInit() {
    this.cargarClientes();
    this.cargarInventario();
    this.cargarActividades();
    this.generarCalendario();
  }

  // -----------------------------------------------------
  // KPI getters
  // -----------------------------------------------------
  cumpleanosHoy() {
    const hoy = new Date();

    return this.clientes().filter((c) => {
      if (!c.fechaNacimiento) return false;

      const cumple = new Date(c.fechaNacimiento);
      return cumple.getDate() === hoy.getDate() && cumple.getMonth() === hoy.getMonth();
    }).length;
  }

  stockBajo() {
    return this.inventario().filter((i) => i.stock <= 10).length;
  }

  actividadesProx() {
    const hoy = new Date();
    return this.actividades().filter((a) => new Date(a.fechaActividad) >= hoy).length;
  }

  // -----------------------------------------------------
  // Cargar actividades desde backend
  // -----------------------------------------------------
  cargarActividades() {
    this.actividadService.get().subscribe((data) => {
      this.actividades.set(data);

      this.actualizarActividadesHoy();
      this.generarCalendario();
    });
  }

  actualizarActividadesHoy() {
    const hoy = new Date();

    this.actividadesHoy = this.actividades().filter((a) => {
      const fecha = new Date(a.fechaActividad);
      return fecha.toDateString() === hoy.toDateString();
    });
  }

  cargarClientes() {
    this.perfilService.get().subscribe((data) => {
      this.clientes.set(data);
    });
  }

  cargarInventario() {
    this.inventarioService.get().subscribe((data) => {
      this.inventario.set(data);
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

      const cumpleanos = this.getCumpleanosDelDia(fecha);

      celdas.push({
        numero: d,
        fecha,
        eventos,
        cumpleanos,
      });
    }

    this.calendario = celdas;
  }

  getCumpleanosDelDia(fecha: Date) {
    return this.clientes().filter((c) => {
      if (!c.fechaNacimiento) return false;

      const cumple = new Date(c.fechaNacimiento);

      return cumple.getDate() === fecha.getDate() && cumple.getMonth() === fecha.getMonth();
    });
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

  calcularEdad(fecha: string) {
    const f = new Date(fecha);
    const hoy = new Date();
    let edad = hoy.getFullYear() - f.getFullYear();
    const m = hoy.getMonth() - f.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < f.getDate())) {
      edad--;
    }
    return edad;
  }

  // -----------------------------------------------------
  // Modal
  // -----------------------------------------------------
  abrirDia(day: any) {
    if (!day.numero) return;

    this.fechaSeleccionada = day.fecha;

    this.actividadesDia = day.eventos;
    this.diaSeleccionadoTexto = day.numero + ' de ' + this.meses[this.mesActual];
    this.cumpleanosDia = this.getCumpleanosDelDia(day.fecha);

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
      fechaBloqueada: true, // <--- ⚡ NUEVO
    } as any;
  }

  editarActividad(ev: ActividadModel) {
    this.modoForm = 'editar';
    this.actividadSeleccionada = ev;
  }

  onCerrarActividad(recargar: boolean) {
    if (recargar) {
      this.cargarActividades();
      this.generarCalendario();
    }

    this.modalAbierto = false; // <--- Cierra el modal completamente
    this.modoForm = null;
    this.actividadSeleccionada = null;
  }
}
