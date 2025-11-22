import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { ActividadModel } from '../../../share/models/actividadModel';
import { ActividadService } from '../../../share/services/actividad.service';
import { PerfilService } from '../../../share/services/perfil.service';
import { InventarioService } from '../../../share/services/inventario.service';

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

  form!: FormGroup;

  // Listas cargadas del backend
  listaPersonas: any[] = []; // Adulto + Admin + Socio
  listaVoluntarios: any[] = [];
  listaInventarios: any[] = [];

  ngOnInit() {
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

    this.cargarListas();

    if (this.modo === 'editar' && this.actividad) {
      this.cargarDatosEdicion();
    }
  }

  async cargarListas() {
    const perfiles = await this.perfilService.get().toPromise();
    const inventarios = await this.inventarioService.get().toPromise();

    this.listaPersonas = perfiles!.filter((p: any) => ['Adulto', 'Admin', 'Socio'].includes(p.rol));

    this.listaVoluntarios = perfiles!.filter((p: any) => p.rol === 'Voluntario');

    this.listaInventarios = inventarios!;
  }

  cargarDatosEdicion() {
    const a = this.actividad!;

    // Convertir fecha a YYYY-MM-DD
    const fecha = a.fechaActividad ? new Date(a.fechaActividad).toISOString().substring(0, 10) : '';

    const hora = a.horaInicio ? new Date(a.horaInicio).toISOString().substring(11, 16) : '';

    this.form.patchValue({
      nombre: a.nombre,
      fechaActividad: fecha,
      horaInicio: hora,
      duracion: a.duracion,
      tipoActividad: a.tipoActividad,
    });

    // Cargar perfiles
    const ids = a
      .perfiles!.filter((p: any) => ['Adulto', 'Admin', 'Socio'].includes(p.perfil.rol))
      .map((p: any) => p.perfil.id);

    this.form.patchValue({ idsPerfiles: ids });

    // Intentar detectar voluntario como encargado
    const encargado = a.perfiles!.find((p: any) => p.perfil.rol === 'Voluntario');

    if (encargado) {
      this.form.patchValue({ idVoluntarioEncargado: encargado.perfil!.id });
    }

    // Inventarios
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

    const payload = {
      nombre: value.nombre,
      fechaActividad: value.fechaActividad,
      horaInicio: value.horaInicio,
      duracion: value.duracion,
      tipoActividad: value.tipoActividad,
      idsPerfiles: [...value.idsPerfiles, value.idVoluntarioEncargado],
      inventarios: value.inventarios,
    };

    if (this.modo === 'crear') {
      this.actividadService.create(payload).subscribe(() => {
        this.cerrar.emit(true);
      });
    } else {
      const itemActualizado = {
        id: this.actividad!.id,
        ...payload,
      };

      this.actividadService.update(itemActualizado).subscribe(() => {
        this.cerrar.emit(true);
      });
    }
  }

  cancelar() {
    this.cerrar.emit(false);
  }
}
