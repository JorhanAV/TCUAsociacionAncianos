import { Component, OnInit, Inject, inject, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PerfilService } from '../../../share/services/perfil.service';
import { environment } from '../../../../environments/environment.development';
import { EEstado, ERol, perfilModel } from '../../../share/models/perfilModel';
import { finalize, Subscription } from 'rxjs'; 
import { UbicacionesService } from '../../../share/services/ubicaciones.service';
import { take, startWith } from 'rxjs/operators'; // Importamos startWith para la carga inicial

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
export class PerfilFormComponent implements OnInit, OnDestroy {
  // inyección
  private fb = inject(FormBuilder);
  private svc = inject(PerfilService);
  private snackBar = inject(MatSnackBar);
  provincias: any[] = [];
  cantones: any[] = [];
  distritos: any[] = [];

  private ubicaciones = inject(UbicacionesService);

  private ubicacionSubs: Subscription[] = []; // Para gestionar las suscripciones de valueChanges

  private imageBaseUrl = environment.imageBaseUrl; 

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

    // Usaremos los códigos (strings) del JSON como valor
    provincia: ['', Validators.required],
    canton: ['', Validators.required],
    distrito: ['', Validators.required],

    rol: [ERol.Voluntario, Validators.required],
    estado: [EEstado.ACTIVO, Validators.required],
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
  fotoFileName: string | null = null; 
  fotoPreviewUrl: string | null = null; 
  guardando = false;

  private pendingFotoFile: File | null = null;

  constructor(
    private dialogRef: MatDialogRef<PerfilFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PerfilDialogData
  ) {}

  ngOnInit(): void {
    // Cargar las provincias estáticas (una sola vez)
    this.ubicaciones.provincias().pipe(take(1)).subscribe((data) => (this.provincias = data));

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
        
        // 🚨 Es crucial que los valores guardados sean el CÓDIGO de la ubicación
        provincia: p.provincia ?? '', 
        canton: p.canton ?? '',
        distrito: p.distrito ?? '',

        rol: p.rol,
        estado: p.estado,
      });

      if (p.fotoURL) {
        this.fotoFileName = p.fotoURL;
        this.fotoPreviewUrl = this.buildFotoUrl(p.fotoURL);
      }
      
      // En modo edición, cargamos las listas iniciales con los valores guardados
      this.loadCantones(p.provincia ?? '');
      this.loadDistritos(p.provincia ?? '', p.canton ?? '');
      
    } else {
      this.modo = 'crear';
      this.title = 'Nuevo perfil';
    }
    
    // 🚀 Configurar la cadena de selectores después de patchValue
    this.setupUbicacionChain();
  }

  // Eliminamos loadCantones/loadDistritos antiguos, o los re-adaptamos para solo cargar la data
  // si el modo es edición y no ha sido cargada la cadena.
  
  /**
   * Carga la lista de cantones para el código de provincia dado.
   * Usado para inicializar en modo Edición.
   */
  loadCantones(provinciaId: string): void {
    if (!provinciaId) return;
    this.ubicaciones.cantones(provinciaId).pipe(take(1)).subscribe(data => {
      this.cantones = data; 
    });
  }

  /**
   * Carga la lista de distritos para el código de provincia y cantón dados.
   * Usado para inicializar en modo Edición.
   */
  loadDistritos(provinciaId: string, cantonId: string): void {
    if (!provinciaId || !cantonId) return;
    this.ubicaciones.distritos(provinciaId, cantonId).pipe(take(1)).subscribe(data => {
      this.distritos = data;
    });
  }


  /**
   * Configura las suscripciones para manejar la carga en cascada de ubicaciones.
   */
  setupUbicacionChain() {
    const pControl = this.form.get('provincia');
    const cControl = this.form.get('canton');
    const dControl = this.form.get('distrito');

    if (!pControl || !cControl || !dControl) return;

    // 🚀 **Cadena de Provincia -> Cantón**
    const provinciaSub = pControl.valueChanges
      .pipe(startWith(pControl.value)) // Dispara la carga inicial si hay valor (edición)
      .subscribe((provinciaId: string | null) => {
        if (!provinciaId) {
          this.cantones = [];
          this.distritos = [];
          cControl.setValue('', { emitEvent: false }); 
          dControl.setValue('', { emitEvent: false });
          return;
        }

        this.ubicaciones.cantones(provinciaId).pipe(take(1)).subscribe((data) => {
          this.cantones = data;
          
          const cantonActual = cControl.value;
          // Si el cantón actual NO existe en la nueva lista de cantones, lo limpiamos.
          // Además, si estamos en modo crear, siempre limpiamos el cantón al cambiar la provincia.
          const shouldResetCanton = this.modo === 'crear' || !cantonActual || !this.cantones.some(c => c.codigo === cantonActual);

          if (shouldResetCanton) {
            cControl.setValue('', { emitEvent: false }); 
            dControl.setValue('', { emitEvent: false });
            this.distritos = [];
          }
          // Si el cantón existe y no se resetea, el valueChanges del Cantón se dispara automáticamente.
        });
      });

    // 🚀 **Cadena de Cantón -> Distrito**
    const cantonSub = cControl.valueChanges
      .pipe(startWith(cControl.value)) // Dispara la carga inicial si hay valor (edición)
      .subscribe((cantonId: string | null) => {
        const provinciaId = pControl.value;

        if (!provinciaId || !cantonId) {
          this.distritos = [];
          dControl.setValue('', { emitEvent: false });
          return;
        }

        this.ubicaciones.distritos(provinciaId, cantonId).pipe(take(1)).subscribe((data) => {
          this.distritos = data;

          const distritoActual = dControl.value;
          // Si el distrito actual NO existe en la nueva lista de distritos, lo limpiamos.
          const shouldResetDistrito = this.modo === 'crear' || !distritoActual || !this.distritos.some(d => d.codigo === distritoActual);

          if (shouldResetDistrito) {
            dControl.setValue('', { emitEvent: false });
          }
        });
      });

    this.ubicacionSubs.push(provinciaSub, cantonSub);
  }
  
  ngOnDestroy(): void {
    this.ubicacionSubs.forEach(sub => sub.unsubscribe());
  }

  // ... (buildFotoUrl, onFileSelected, createFormData, save, removePhoto, cancel se mantienen igual) ...

  private buildFotoUrl(fileName: string | null): string | null {
    if (!fileName) return null;
    const baseUrl = this.imageBaseUrl.endsWith('/') ? this.imageBaseUrl : this.imageBaseUrl + '/';
    return `${baseUrl}${fileName}`;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    this.pendingFotoFile = file;
    this.fotoPreviewUrl = URL.createObjectURL(file);
    this.showSuccess('Nueva foto seleccionada. Guarde el perfil para aplicar los cambios.');
  }

  private createFormData(payloadBase: Partial<perfilModel>): FormData {
    const formData = new FormData();

    (Object.keys(payloadBase) as Array<keyof Partial<perfilModel>>).forEach((key) => {
      const value = payloadBase[key];
      if (value !== null && value !== undefined) {
        if (key === 'fechaNacimiento') {
          formData.append(key as string, new Date(value as string | Date).toISOString());
        } else {
          // Aseguramos que provincia, canton y distrito se envíen como códigos
          formData.append(key as string, String(value));
        }
      }
    });

    if (this.pendingFotoFile) {
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
      nombre: raw.nombre,
      fechaNacimiento: fecha?.toISOString(),
      cedula: raw.cedula,
      rol: raw.rol,
      estado: raw.estado,
      telefonoContacto: raw.telefonoContacto || null,
      numeroCelular: raw.numeroCelular || null,
      direccion: raw.direccion || null,

      // 🚨 Los valores del formulario (código de provincia/cantón/distrito) se envían directamente
      provincia: raw.provincia || null, 
      canton: raw.canton || null,
      distrito: raw.distrito || null,
    };

    this.guardando = true;

    const formData = this.createFormData(payloadBase);

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
    this.pendingFotoFile = null;
    this.fotoPreviewUrl = null;
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

  // ---- MÁSCARAS (se mantienen igual) ----
  onlyNumbers(e: any, controlName: string) {
    const clean = e.target.value.replace(/\D/g, '');
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(clean, { emitEvent: false });
    }
  }

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