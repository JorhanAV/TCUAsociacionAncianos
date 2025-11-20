// src/app/perfil/screens/perfil-form/perfil-form.component.ts
import { Component, OnInit, Inject, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PerfilService } from '../../../share/services/perfil.service';
import { ImageService } from '../../../share/services/image.service';
import { environment } from '../../../../environments/environment.development';
import { EEstado, ERol, perfilModel } from '../../../share/models/perfilModel';

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
  // inyección
  private fb = inject(FormBuilder);
  private svc = inject(PerfilService);
  private imageSvc = inject(ImageService);
  private snackBar = inject(MatSnackBar);

  private imageBaseUrl = environment.imageBaseUrl; // 'http://localhost:3000/imagenes/'

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

  // FOTO
  fotoFileName: string | null = null;   // lo que se guarda en fotoURL
  fotoPreviewUrl: string | null = null; // URL completa para <img>
  subiendoFoto = false;
  guardando = false;

  // para creación (no hay id todavía)
  private pendingFotoFile: File | null = null;

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

      if (p.fotoURL) {
        this.fotoFileName = p.fotoURL;
        this.fotoPreviewUrl = this.buildFotoUrl(p.fotoURL);
      }
    } else {
      this.modo = 'crear';
      this.title = 'Nuevo perfil';
    }
  }

  private buildFotoUrl(fileName: string | null): string | null {
    if (!fileName) return null;
    return `${this.imageBaseUrl}${fileName}`;
  }

  // cuando se selecciona una imagen
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // EDITAR: ya existe el perfil en BD, podemos subir de una vez
    if (this.idPerfil) {
      this.subiendoFoto = true;

      this.imageSvc.uploadPerfilFoto(file, this.fotoFileName).subscribe({
        next: (res: any[]) => {
          this.subiendoFoto = false;

          const first = res && res[0];
          if (first?.fileName) {
            this.fotoFileName = first.fileName;
            this.fotoPreviewUrl = this.buildFotoUrl(first.fileName);
            this.showSuccess('Foto subida. Se guardará al actualizar el perfil.');
          } else {
            this.showError('No se recibió el nombre del archivo de la API.');
          }
        },
        error: (err) => {
          console.error('Error subiendo foto de perfil', err);
          this.subiendoFoto = false;
          this.showError('Error al subir la foto de perfil.');
        },
      });
    } else {
      // CREAR: aún no hay perfil en BD
      // guardamos el file pendiente y mostramos preview local
      this.pendingFotoFile = file;
      this.fotoPreviewUrl = URL.createObjectURL(file);
      this.showSuccess('La foto se subirá cuando crees el perfil.');
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showError('Revisa los campos del formulario.');
      return;
    }

    const raw: any = this.form.value;
    const fecha = raw.fechaNacimiento as Date | null;

    const payloadBase: Partial<perfilModel> = {
      ...(this.idPerfil ? { id: this.idPerfil } : {}),
      nombre: raw.nombre ?? '',
      fechaNacimiento: fecha ? fecha.toISOString() : new Date().toISOString(),
      cedula: raw.cedula ?? '',
      rol: raw.rol as ERol,
      estado: raw.estado as EEstado,
      telefonoContacto: raw.telefonoContacto || null,
      numeroCelular: raw.numeroCelular || null,
      direccion: raw.direccion || null,
      // fotoURL: se mantiene la actual si ya la tenemos
      fotoURL: this.fotoFileName ?? this.data?.perfil?.fotoURL ?? null,
    };

    this.guardando = true;

    if (this.modo === 'crear') {
      // 1) Creamos el perfil
      this.svc.create(payloadBase as perfilModel).subscribe({
        next: (created: perfilModel) => {
          // 2) Si hay foto pendiente, la subimos AHORA y luego hacemos un update con fotoURL
          if (this.pendingFotoFile) {
            this.subiendoFoto = true;

            this.imageSvc.uploadPerfilFoto(this.pendingFotoFile, null).subscribe({
              next: (res: any[]) => {
                this.subiendoFoto = false;
                const first = res && res[0];

                if (first?.fileName) {
                  const patch: perfilModel = {
                    ...created,
                    fotoURL: first.fileName,
                  };

                  this.svc.update(patch).subscribe({
                    next: () => {
                      this.guardando = false;
                      this.showSuccess('Perfil creado con foto correctamente.');
                      this.dialogRef.close(true);
                    },
                    error: (err) => {
                      console.error('Error actualizando fotoURL tras crear perfil', err);
                      this.guardando = false;
                      this.showError('Perfil creado, pero hubo un error al guardar la foto.');
                      this.dialogRef.close(true);
                    },
                  });
                } else {
                  this.guardando = false;
                  this.showError('Perfil creado, pero la API no devolvió el nombre de la foto.');
                  this.dialogRef.close(true);
                }
              },
              error: (err) => {
                console.error('Error subiendo foto tras crear perfil', err);
                this.subiendoFoto = false;
                this.guardando = false;
                this.showError('Perfil creado, pero hubo un error al subir la foto.');
                this.dialogRef.close(true);
              },
            });
          } else {
            // sin foto
            this.guardando = false;
            this.showSuccess('Perfil creado correctamente.');
            this.dialogRef.close(true);
          }
        },
        error: (err) => {
          console.error('Error creando perfil', err);
          this.guardando = false;
          this.showError('Ocurrió un error al crear el perfil.');
        },
      });
    } else {
      // EDITAR: actualizamos datos + fotoURL (si ya cambió con onFileSelected)
      this.svc.update(payloadBase as perfilModel).subscribe({
        next: () => {
          this.guardando = false;
          this.showSuccess('Perfil actualizado correctamente.');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error actualizando perfil', err);
          this.guardando = false;
          this.showError('Ocurrió un error al actualizar el perfil.');
        },
      });
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }

  private showSuccess(msg: string) {
    this.snackBar.open(msg, 'OK', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'],
    });
  }

  private showError(msg: string) {
    this.snackBar.open(msg, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-error'],
    });
  }
}
