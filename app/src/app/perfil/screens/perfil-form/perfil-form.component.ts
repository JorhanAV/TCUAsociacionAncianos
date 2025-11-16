import { Component, OnInit, inject, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PerfilService } from '../../../share/services/perfil.service';
import { ERol, EEstado, perfilModel } from '../../../share/models/perfilModel';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../../share/notification-service';

export interface PerfilDialogData {
  modo: 'crear' | 'editar';
  perfil: perfilModel | null;
}

@Component({
  selector: 'app-perfil-form',
  templateUrl: './perfil-form.component.html',
  styleUrl: './perfil-form.component.scss',
  standalone: false,
})
export class PerfilFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(PerfilService);
  private snackBar = inject(MatSnackBar);
  private noti = inject(NotificationService);

  title = 'Nuevo perfil';
  roles = Object.values(ERol);
  estados = Object.values(EEstado);

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    fechaNacimiento: [null as Date | null, [Validators.required]],
    cedula: ['', [Validators.required]],
    telefonoContacto: [''],
    numeroCelular: [''],
    direccion: [''],
    rol: [ERol.Voluntario as ERol, Validators.required],
    estado: [EEstado.ACTIVO as EEstado, Validators.required],
  });

  modo: 'crear' | 'editar' = 'crear';
  private idPerfil?: number;
  guardando = false;

  constructor(
    private dialogRef: MatDialogRef<PerfilFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PerfilDialogData
  ) {}

  ngOnInit(): void {
    this.modo = this.data?.modo ?? 'crear';

    if (this.data?.perfil) {
      const p = this.data.perfil;
      this.modo = 'editar';
      this.title = 'Editar perfil';
      this.idPerfil = p.id;

      this.form.patchValue({
        nombre: p.nombre ?? '',
        fechaNacimiento: p.fechaNacimiento ? new Date(p.fechaNacimiento) : null,
        cedula: p.cedula ?? '',
        telefonoContacto: p.telefonoContacto ?? '',
        numeroCelular: p.numeroCelular ?? '',
        direccion: p.direccion ?? '',
        rol: p.rol as ERol,
        estado: p.estado as EEstado,
      });
    } else {
      this.modo = 'crear';
      this.title = 'Nuevo perfil';
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mostrarToastError('Revisa los campos del formulario.');
      return;
    }

    const raw = this.form.value;
    const fecha = raw.fechaNacimiento as Date | null;

    const payload: perfilModel = {
      ...(this.idPerfil ? { id: this.idPerfil } : ({} as any)),

      nombre: raw.nombre ?? '',
      fechaNacimiento: fecha ? fecha.toISOString() : new Date().toISOString(),
      cedula: raw.cedula ?? '',
      rol: raw.rol as ERol,
      estado: raw.estado as EEstado,

      telefonoContacto: raw.telefonoContacto || null,
      numeroCelular: raw.numeroCelular || null,
      direccion: raw.direccion || null,

      // no tocamos imagen todavía
      fotoURL: this.data?.perfil?.fotoURL ?? null,
    };

    this.guardando = true;

    const peticion$ =
      this.modo === 'crear'
        ? this.svc.create(payload)
        : this.svc.update(payload);

    peticion$.subscribe({
      next: () => {
        this.guardando = false;

        const mensaje =
          this.modo === 'crear'
            ? '✔ Perfil creado correctamente.'
            : '✔ Perfil actualizado correctamente.';

        this.mostrarToastExito(mensaje);

        this.dialogRef.close(true); // recargar lista
      },
      error: (err) => {
        console.error('Error guardando perfil', err);
        this.guardando = false;
        this.mostrarToastError('Ocurrió un error al guardar el perfil.');
        this.dialogRef.close(false);
      },
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }

  // helpers igual que en Inventario
  private mostrarToastExito(mensaje: string): void {
    this.snackBar.open(mensaje, 'OK', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'],
    });
    // si tu NotificationService hace algo extra, puedes llamarlo también
    // this.noti.success(mensaje);
  }

  private mostrarToastError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-error'],
    });
    // this.noti.error(mensaje);
  }
}
