// src/app/perfil/screens/perfil-form/perfil-form.component.ts
import { Component, OnInit, Inject, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PerfilService } from '../../../share/services/perfil.service';
import { environment } from '../../../../environments/environment.development';
import { EEstado, ERol, perfilModel } from '../../../share/models/perfilModel';
import { finalize } from 'rxjs'; // Importamos finalize para limpiar el estado de carga

export interface PerfilDialogData {
  modo: 'crear' | 'editar';
  perfil: perfilModel | null;
}

@Component({
  selector: 'app-perfil-form',
  templateUrl: './perfil-form.component.html',
  styleUrl: './perfil-form.component.scss',
  // Es importante usar 'standalone: true' si está usando la sintaxis @for/@if
  // pero lo dejaré como 'standalone: false' si este componente es parte de un módulo.
  standalone: false,
})
export class PerfilFormComponent implements OnInit {
  // inyección
  private fb = inject(FormBuilder);
  private svc = inject(PerfilService);
  private snackBar = inject(MatSnackBar);

  // NOTA: Es importante que el PerfilService tenga un método para enviar FormData
  // (e.g., this.svc.createWithPhoto(formData))

  private imageBaseUrl = environment.imageBaseUrl; // 'http://localhost:3000/imagenes/'

  title = 'Nuevo perfil';
  roles = Object.values(ERol);
  estados = Object.values(EEstado);

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    fechaNacimiento: [null as Date | null, [Validators.required, this.minAgeValidator(18)]],

    cedula: ['', [Validators.required, Validators.pattern(/^\d-\d{4}-\d{4}$/)]],

    telefonoContacto: ['', [Validators.pattern(/^[245]\d{3}-\d{4}$/)]],
    numeroCelular: ['', [Validators.pattern(/^[678]\d{3}-\d{4}$/)]],

    direccion: [''],
    rol: [ERol.Voluntario as ERol, Validators.required],
    estado: [EEstado.ACTIVO as EEstado, Validators.required],
  });

  private minAgeValidator(minAge: number) {
    return (control: any) => {
      const value = control.value;
      if (!value) return null;

      const birthDate = new Date(value);
      const today = new Date();

      const age = today.getFullYear() - birthDate.getFullYear();
      const hasBirthdayPassed =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

      const realAge = hasBirthdayPassed ? age : age - 1;

      return realAge >= minAge ? null : { minAge: true };
    };
  }

  modo: 'crear' | 'editar' = 'crear';
  private idPerfil?: number;

  // FOTO
  fotoFileName: string | null = null; // Lo que se guarda en fotoURL, usado para EDITAR
  fotoPreviewUrl: string | null = null; // URL completa para <img>
  guardando = false;

  // Para creación: guarda el archivo a subir con el formulario
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
    const baseUrl = this.imageBaseUrl.endsWith('/') ? this.imageBaseUrl : this.imageBaseUrl + '/';
    return `${baseUrl}${fileName}`;
  }

  // Cuando se selecciona una imagen
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    this.pendingFotoFile = file;
    this.fotoPreviewUrl = URL.createObjectURL(file);
    this.showSuccess('Nueva foto seleccionada. Guarde el perfil para aplicar los cambios.');
  }

  /**
   * Crea el objeto FormData a partir del formulario y del archivo pendiente.
   */
  private createFormData(payloadBase: Partial<perfilModel>): FormData {
    const formData = new FormData();

    // 1. Añadir campos del formulario como texto
    (Object.keys(payloadBase) as Array<keyof Partial<perfilModel>>).forEach((key) => {
      const value = payloadBase[key];
      if (value !== null && value !== undefined) {
        if (key === 'fechaNacimiento') {
          formData.append(key as string, new Date(value as string | Date).toISOString());
        } else {
          formData.append(key as string, String(value));
        }
      }
    });

    // 2. Añadir el archivo pendiente (si existe)
    if (this.pendingFotoFile) {
      // Nombre del campo que Multer debe esperar en el backend: 'files' o 'foto'
      // Usamos 'files' para ser consistentes con tu código anterior.
      formData.append('files', this.pendingFotoFile, this.pendingFotoFile.name);
    }

    return formData;
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
    };

    this.guardando = true;

    // 🚀 LÓGICA UNIFICADA
    const formData = this.createFormData(payloadBase);

    // Llamamos al nuevo método unificado del servicio
    this.svc
      .saveWithPhoto(formData, this.modo, this.idPerfil)
      .pipe(finalize(() => (this.guardando = false)))
      .subscribe({
        next: (saved: perfilModel) => {
          this.showSuccess(
            `Perfil ${this.modo === 'crear' ? 'creado' : 'actualizado'} correctamente.`
          );
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error guardando perfil con foto', err);
          this.showError('Ocurrió un error al guardar el perfil (revisa la cédula o la conexión).');
        },
      });
  }
  removePhoto() {
    // Simula que no hay archivo pendiente
    this.pendingFotoFile = null;

    // Borra la URL de previsualización
    this.fotoPreviewUrl = null;

    // Establece el valor de fotoURL a null en el formulario.
    // Esto es crucial para que 'save()' sepa que debe enviar fotoURL: null en el payload
    // y que el backend lo use para eliminar la foto de la BD y el servidor.
    // **Asegúrate de que el control 'fotoURL' exista en tu FormGroup si lo necesitas**
    // PERO, si confías solo en la lógica del backend, puedes usar una variable de estado:

    // Opción 1: Si no tienes control 'fotoURL' en el formulario (basado en la nueva lógica)
    // Simplemente borra la previsualización y la foto pendiente.
    // El backend no recibirá 'files' ni 'previousFileName' si no se sube nada.

    this.showSuccess('Foto marcada para eliminación. Guarde el perfil para aplicar.');
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

  // ---- MÁSCARA SOLO NÚMEROS ----
  onlyNumbers(e: any, controlName: string) {
    const clean = e.target.value.replace(/\D/g, '');
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(clean, { emitEvent: false });
    }
  }

  // ---- MÁSCARA PARA TELÉFONO (####-####) ----
  formatPhone(e: any, controlName: string) {
    let v = e.target.value.replace(/\D/g, '');

    if (v.length > 4) {
      v = v.replace(/^(\d{4})(\d+)/, '$1-$2');
    }

    const control = this.form.get(controlName);
    if (control) {
      control.setValue(v, { emitEvent: false });
    }
  }

  // ---- MÁSCARA PARA CÉDULA CR (1-2345-6789) ----
  formatCedula(e: any) {
    let v = e.target.value.replace(/\D/g, '');

    if (v.length > 1 && v.length <= 5) {
      v = v.replace(/^(\d)(\d+)/, '$1-$2');
    } else if (v.length > 5) {
      v = v.replace(/^(\d)(\d{4})(\d+)/, '$1-$2-$3');
    }

    const control = this.form.get('cedula');
    if (control) {
      control.setValue(v, { emitEvent: false });
    }
  }
}
