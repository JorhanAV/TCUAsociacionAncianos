// src/app/home/inventario/inventario-form/inventario-form.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { InventarioModel } from '../../share/models/inventarioModel';
import { ECategoria } from '../../share/models/categoriaModel';
import { EEstado } from '../../share/models/estadoModel';
import { InventarioService } from '../../share/services/inventario.service';

@Component({
  selector: 'app-inventario-form',
  templateUrl: './inventario-form.html',
  standalone: false,
  styleUrls: ['./inventario-form.css'],
})
export class InventarioForm implements OnInit {
  @Input() inventario: InventarioModel | null = null;
  @Input() modo: 'crear' | 'editar' = 'crear';
  @Output() cerrar = new EventEmitter<boolean>(); // true => guardó, false => solo cerró

  form!: FormGroup;

  titulo = 'Nuevo producto de inventario';

  categorias = Object.values(ECategoria);
  estados = Object.values(EEstado);

  cargandoDatos = false;
  guardando = false;
  private idInventario?: number;

  constructor(
    private fb: FormBuilder,
    private inventarioService: InventarioService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      Nombre: ['', [Validators.required, Validators.maxLength(191)]],
      descripcion: ['', [Validators.maxLength(500)]],
      idCategoria: [ECategoria.Medicinas, [Validators.required]],
      stock: [0, [Validators.required, Validators.min(0)]],
      estado: [EEstado.ACTIVO, [Validators.required]],
    });

    if (this.inventario) {
      this.modo = 'editar';
      this.titulo = 'Editar producto de inventario';
      this.idInventario = this.inventario.id;

      this.form.patchValue({
        Nombre: this.inventario.Nombre,
        descripcion: this.inventario.descripcion,
        idCategoria: this.inventario.idCategoria,
        stock: this.inventario.stock,
        estado: this.inventario.estado,
      });
    } else {
      this.modo = 'crear';
      this.titulo = 'Nuevo producto de inventario';
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: InventarioModel = {
      ...(this.idInventario ? { id: this.idInventario } : {}),
      ...this.form.value,
    };

    this.guardando = true;

    const peticion$ =
      this.modo === 'crear'
        ? this.inventarioService.create(payload)
        : this.inventarioService.update(payload); // BaseAPI.update(item)

    peticion$.subscribe({
      next: () => {
        this.guardando = false;
        // avisamos al padre que se guardó OK
        this.cerrar.emit(true);
      },
      error: (err) => {
        console.error(err);
        this.guardando = false;
        // podrías mostrar un snackbar aquí
      },
    });
  }

  volver(): void {
    // Volver / Cancelar => cerrar sin recargar
    this.cerrar.emit(false);
  }

  campoInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.invalid && control.touched;
  }
}
