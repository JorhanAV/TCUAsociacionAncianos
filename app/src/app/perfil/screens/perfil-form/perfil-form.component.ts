import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PerfilService } from '../../../share/services/perfil.service';
import { ERol, EEstado, PerfilModel } from '../../../share/models/PerfilModel';

@Component({
  selector: 'app-perfil-form',
  templateUrl: './perfil-form.component.html',
  styleUrl: './perfil-form.component.scss',
  standalone:false
})
export class PerfilFormComponent implements OnInit {
  // inyección moderna
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private svc = inject(PerfilService);

  id?: number;
  title = 'Nuevo perfil';

  roles = Object.values(ERol);
  estados = Object.values(EEstado);

  // ahora sí podemos usar fb sin error
  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.email]],
    telefono: [''],
    rol: [ERol.Voluntario as ERol, Validators.required],
    estado: [EEstado.ACTIVO as EEstado, Validators.required],
  });

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      this.id = Number(param);
      this.title = 'Editar perfil';

      this.svc.getById(this.id).subscribe((p: PerfilModel) => {
        this.form.patchValue({
          nombre: (p as any).nombre ?? '',
          email: (p as any).email ?? '',
          telefono: (p as any).telefono ?? '',
          rol: p.rol as ERol,
          estado: p.estado as EEstado,
        });
      });
    }
  }

  save() {
    if (this.form.invalid) return;

    const payload = this.form.value as any;

    if (this.id) {
      // ver punto 2: update()
      const body: PerfilModel = { ...payload, id: this.id } as PerfilModel;
      this.svc.update(body).subscribe(() => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
    } else {
      this.svc.create(payload).subscribe(() => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
    }
  }

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
