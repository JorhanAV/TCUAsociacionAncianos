import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { ActividadModel } from '../../../share/models/actividadModel';
import { ActividadService } from '../../../share/services/actividad.service';
import { PerfilService } from '../../../share/services/perfil.service';
import { InventarioService } from '../../../share/services/inventario.service';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-actividad-form',
  standalone: false,
  templateUrl: './actividad-form.html',
  styleUrls: ['./actividad-form.scss'],
})
export class ActividadForm implements OnInit {
  @Input() actividad: ActividadModel | null = null;
  @Input() modo: 'crear' | 'editar' = 'crear';
  @Output() cerrar = new EventEmitter<boolean>();

  fb = inject(FormBuilder);
  actividadService = inject(ActividadService);
  perfilService = inject(PerfilService);
  inventarioService = inject(InventarioService);
  snack = inject(MatSnackBar);

  form!: FormGroup;

  listaPersonas: any[] = [];
  listaVoluntarios: any[] = [];
  listaInventarios: any[] = [];

  horasDisponibles: string[] = [];

  async ngOnInit() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      fechaActividad: ['', [Validators.required, this.fechaNoPasadaValidator]],
      horaInicio: ['', Validators.required],
      duracion: ['', [Validators.required, Validators.min(1)]],
      tipoActividad: ['', Validators.required],

      idsPerfiles: [[]],
      idVoluntarioEncargado: ['', Validators.required],

      inventarios: this.fb.array([]),
    });

    // Generar horas al cambiar fecha
    this.form.get('fechaActividad')?.valueChanges.subscribe((valor) => {
      this.generarHorasDisponibles(valor);
    });

    await this.cargarListas();

    if (this.modo === 'editar' && this.actividad) {
      this.cargarDatosEdicion();
    }
  }

  async cargarListas() {
    const perfiles = await firstValueFrom(this.perfilService.get());
    const inventarios = await firstValueFrom(this.inventarioService.get());

    this.listaPersonas = perfiles.filter((p: any) =>
      ['Adulto', 'Admin', 'Socio'].includes(p.rol)
    );

    this.listaVoluntarios = perfiles.filter((p: any) => p.rol === 'Voluntario');

    this.listaInventarios = inventarios;
  }

  cargarDatosEdicion() {
    const a = this.actividad!;

    const fecha = new Date(a.fechaActividad);

    // ========= CONVERTIR HORA A FORMATO 12h ==========
    const horaOriginal = new Date(a.horaInicio);
    let h = horaOriginal.getHours();
    let m = horaOriginal.getMinutes();

    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    const mm = m.toString().padStart(2, '0');
    const horaFormateada = `${h12}:${mm} ${ampm}`;

    // =================================================

    this.form.patchValue({
      nombre: a.nombre,
      fechaActividad: fecha,
      horaInicio: horaFormateada,
      duracion: a.duracion,
      tipoActividad: a.tipoActividad,
    });

    const idsPerfiles = a.perfiles!
      .filter((p: any) => ['Adulto', 'Admin', 'Socio'].includes(p.perfil.rol))
      .map((p: any) => p.perfil.id);

    this.form.patchValue({ idsPerfiles });

    const voluntario = a.perfiles!.find((p: any) => p.perfil.rol === 'Voluntario');
    if (voluntario) {
      this.form.patchValue({ idVoluntarioEncargado: voluntario.perfil!.id });
    }

    a.inventarios!.forEach((i: any) => {
      this.agregarInventario(i.inventario.id, i.cantidadxPersona);
    });

    // Generar horas según fecha de edición
    this.generarHorasDisponibles(fecha);
  }

  // ========= Inventarios Dinámicos ==========
  get inventariosArr(): FormArray<FormGroup> {
    return this.form.get('inventarios') as FormArray<FormGroup>;
  }

  agregarInventario(idInventario: number = 0, cantidad: number = 1) {
    const grupo = this.fb.group({
      idInventario: [idInventario, Validators.required],
      cantidadxPersona: [cantidad, [Validators.required, Validators.min(1)]],
    });
    this.inventariosArr.push(grupo);
  }

  eliminarInventario(index: number) {
    this.inventariosArr.removeAt(index);
  }

  // ========= Guardar ==========
  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;

    // Convertir fecha YYYY-MM-DD
    function convertirFecha(fecha: any): string {
      if (!fecha) return '';

      if (fecha instanceof Date) {
        const y = fecha.getFullYear();
        const m = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const d = fecha.getDate().toString().padStart(2, '0');
        return `${y}-${m}-${d}`;
      }

      return fecha;
    }

    const fechaISO = convertirFecha(value.fechaActividad);

    // Convertir hora "8:30 AM" → "HH:mm:ss"
    function convertirHora(hora: string): string {
      const [time, mod] = hora.split(' ');
      let [h, m] = time.split(':').map(Number);

      if (mod === 'PM' && h < 12) h += 12;
      if (mod === 'AM' && h === 12) h = 0;

      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
    }

    const hora24 = convertirHora(value.horaInicio);
    const horaInicioFinal = new Date(`${fechaISO}T${hora24}`);

    const payload = {
      nombre: value.nombre,
      fechaActividad: value.fechaActividad,
      horaInicio: horaInicioFinal,
      duracion: value.duracion,
      tipoActividad: value.tipoActividad,
      idsPerfiles: [...value.idsPerfiles, value.idVoluntarioEncargado],
      inventarios: value.inventarios,
    };

    if (this.modo === 'crear') {
      this.actividadService.create(payload).subscribe({
        next: () => {
          this.snack.open('✔ Actividad creada exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: 'snackbar-success',
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.cerrar.emit(true);
        },
        error: () => {
          this.snack.open('X Ocurrió un error al crear la actividad', 'Cerrar', {
            duration: 3000,
            panelClass: 'snackbar-error',
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        },
      });
    } else {
      const itemActualizado = { id: this.actividad!.id, ...payload };

      this.actividadService.update(itemActualizado).subscribe({
        next: () => {
          this.snack.open('✔ Actividad actualizada correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: 'snackbar-success',
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.cerrar.emit(true);
        },
        error: () => {
          this.snack.open('X Error al actualizar la actividad', 'Cerrar', {
            duration: 3000,
            panelClass: 'snackbar-error',
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        },
      });
    }
  }

  cancelar() {
    this.cerrar.emit(false);
  }

  // ========= Validaciones ==========
  fechaNoPasadaValidator(control: any) {
    const valor = control.value;
    if (!valor) return null;

    const f = new Date(valor);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    f.setHours(0, 0, 0, 0);

    return f < hoy ? { fechaPasada: true } : null;
  }

  // ========= Generador de Horas ==========
  generarHorasDisponibles(fecha: Date) {
    const horas: string[] = [];
    const hoy = new Date();

    const fechaEsHoy =
      fecha && new Date(fecha).toDateString() === hoy.toDateString();

    const horaActual = hoy.getHours();
    const minutoActual = hoy.getMinutes();

    for (let h = 4; h <= 22; h++) {
      for (let m of [0, 30]) {
        const esFuturo =
          !fechaEsHoy ||
          h > horaActual ||
          (h === horaActual && m >= minutoActual);

        if (esFuturo) {
          const ampm = h >= 12 ? 'PM' : 'AM';
          const h12 = h % 12 === 0 ? 12 : h % 12;
          const mm = m.toString().padStart(2, '0');
          horas.push(`${h12}:${mm} ${ampm}`);
        }
      }
    }

    this.horasDisponibles = horas;
  }
}
