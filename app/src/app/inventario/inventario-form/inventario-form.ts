// src/app/home/inventario/inventario-form/inventario-form.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
  form!: FormGroup;

  titulo = 'Nuevo producto de inventario';
  modo: 'crear' | 'editar' = 'crear';

  categorias = Object.values(ECategoria);
  estados = Object.values(EEstado);

  cargandoDatos = false;
  guardando = false;
  idInventario?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
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

    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.modo = 'editar';
      this.titulo = 'Editar producto de inventario';
      this.idInventario = Number(idParam);
      this.cargarInventario(this.idInventario);
    }
  }

  cargarInventario(id: number): void {
    this.cargandoDatos = true;

    this.inventarioService.getById(id).subscribe({
      next: (data) => {
        this.form.patchValue({
          Nombre: data.Nombre,
          descripcion: data.descripcion,
          idCategoria: data.idCategoria,
          stock: data.stock,
          estado: data.estado,
        });
        this.cargandoDatos = false;
      },
      error: (err) => {
        console.error(err);
        this.cargandoDatos = false;
        // si falla, puedes llevar al usuario de nuevo al listado
        this.volver();
      },
    });
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
        : this.inventarioService.update(payload); // ⚠️ usa BaseAPI.update(item)

    peticion$.subscribe({
      next: () => {
        this.guardando = false;
        this.volver();
      },
      error: (err) => {
        console.error(err);
        this.guardando = false;
        // aquí podrías mostrar un snackbar/toast
      },
    });
  }

  volver(): void {
    this.router.navigate(['/inventario']);
  }

  campoInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.invalid && control.touched;
  }
}
