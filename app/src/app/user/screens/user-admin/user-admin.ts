import { Component, computed, inject, signal } from '@angular/core';
import { UsuarioModel } from '../../../share/models/usuarioModel';
import { UsuarioService } from '../../../share/services/usuario.service';

@Component({
  selector: 'app-user-admin',
  standalone: false,
  templateUrl: './user-admin.html',
  styleUrls: ['./user-admin.scss'],
})
export class UserAdmin {
  private usuarioService = inject(UsuarioService);

  usuarios = signal<UsuarioModel[]>([]);
  filtro = signal('');

  // Control del modal manual
  mostrarForm = false;
  modoForm: 'crear' | 'editar' = 'crear';
  usuarioSeleccionado: UsuarioModel | null = null;

  usuariosFiltrados = computed(() => {
    const f = this.filtro().toLowerCase();
    return this.usuarios().filter(
      (u) =>
        u.nombre_usuario.toLowerCase().includes(f) ||
        u.correo.toLowerCase().includes(f) ||
        u.rol.toLowerCase().includes(f)
    );
  });

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.get().subscribe({
      next: (res) => this.usuarios.set(res),
      error: (err) => console.error(err),
    });
  }

  // === Modal Mostrar / Ocultar ===
  abrirFormCrear() {
    this.modoForm = 'crear';
    this.usuarioSeleccionado = null;
    this.mostrarForm = true;
  }

  abrirFormEditar(usuario: UsuarioModel) {
    this.modoForm = 'editar';
    this.usuarioSeleccionado = usuario;
    this.mostrarForm = true;
  }

  cerrarForm(refresh: boolean) {
    this.mostrarForm = false;
    if (refresh) this.cargarUsuarios();
  }
}
