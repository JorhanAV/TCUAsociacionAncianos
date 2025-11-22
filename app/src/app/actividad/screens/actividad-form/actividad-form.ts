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

  // Listas cargadas del backend
  listaPersonas: any[] = []; // Adulto + Admin + Socio
  listaVoluntarios: any[] = [];
  listaInventarios: any[] = [];

  async ngOnInit() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      fechaActividad: ['', Validators.required],
      horaInicio: ['', Validators.required],
      duracion: ['', [Validators.required, Validators.min(1)]],
      tipoActividad: ['', Validators.required],

      // seleccionados
      idsPerfiles: [[]],
      idVoluntarioEncargado: [''],

      inventarios: this.fb.array([]),
    });

    await this.cargarListas();

    if (this.modo === 'editar' && this.actividad) {
      this.cargarDatosEdicion();
    }
  }

  async cargarListas() {
    const perfiles = await firstValueFrom(this.perfilService.get());
    const inventarios = await firstValueFrom(this.inventarioService.get());

    this.listaPersonas = perfiles.filter((p: any) => ['Adulto', 'Admin', 'Socio'].includes(p.rol));

    this.listaVoluntarios = perfiles.filter((p: any) => p.rol === 'Voluntario');

    this.listaInventarios = inventarios;
  }

  cargarDatosEdicion() {
    const a = this.actividad!;

    // ---> FECHA Y HORA
    const fecha = new Date(a.fechaActividad).toISOString().substring(0, 10);
    const hora = new Date(a.horaInicio).toISOString().substring(11, 16);

    this.form.patchValue({
      nombre: a.nombre,
      fechaActividad: fecha,
      horaInicio: hora,
      duracion: a.duracion,
      tipoActividad: a.tipoActividad,
    });

    // ---> PERFILES SELECCIONADOS
    const idsPerfiles = a
      .perfiles!.filter((p: any) => ['Adulto', 'Admin', 'Socio'].includes(p.perfil.rol))
      .map((p: any) => p.perfil.id);

    this.form.patchValue({ idsPerfiles });

    // ---> VOLUNTARIO ENCARGADO
    const voluntario = a.perfiles!.find((p: any) => p.perfil.rol === 'Voluntario');
    if (voluntario) {
      this.form.patchValue({ idVoluntarioEncargado: voluntario.perfil!.id });
    }

    // ---> INVENTARIOS (YA TENEMOS listaInventarios cargada!)
    a.inventarios!.forEach((i: any) => {
      this.agregarInventario(i.inventario.id, i.cantidadxPersona);
    });
  }

  // ------------ INVENTARIOS DINÁMICOS ---------------
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

  // ------------ GUARDAR ---------------
  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;

    // Convertir fecha yyyy-mm-dd a Date base
    const fechaBase = value.fechaActividad;

    // Convertir hora a formato 24h válido
    function convertirHora(hora: string): string {
      // Caso 24h directo: "15:00"
      if (!hora.includes(' ')) {
        return `${hora}:00`; // → "15:00:00"
      }

      // Caso 12h: "03:00 PM"
      const [time, modifier] = hora.split(' ');
      let [h, m] = time.split(':').map(Number);

      if (modifier === 'PM' && h < 12) h += 12;
      if (modifier === 'AM' && h === 12) h = 0;

      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
    }

    const hora24 = convertirHora(value.horaInicio);

    // Crear Date completo válido
    const horaInicioFinal = new Date(`${fechaBase}T${hora24}`);

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
      const itemActualizado = {
        id: this.actividad!.id,
        ...payload,
      };

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
}
