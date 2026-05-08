import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: any[] = [];

  nuevoUsuario = {
    nombre: '',
    password: '',
    rol: ''
  };

  usuarioEditando: any = null;

  busqueda: string = '';

  toastVisible: boolean = false;
  toastMensaje: string = '';
  toastTipo: 'success' | 'error' | 'warning' | 'info' = 'info';

  constructor(
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.listarUsuarios().subscribe({
      next: (data: any[]) => {
        this.usuarios = data || [];
        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Error al cargar usuarios', err);

        this.usuarios = [];
        this.mostrarToast('No fue posible cargar los usuarios.', 'error');

        this.cdr.detectChanges();
      }
    });
  }

  crearUsuario(): void {
    if (!this.formularioValidoParaCrear()) {
      this.mostrarToast('Debes ingresar nombre, contraseña y rol.', 'warning');
      return;
    }

    this.usuarioService.crearUsuario(this.nuevoUsuario).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.limpiarFormulario();

        this.mostrarToast('Usuario creado correctamente.', 'success');
        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Error al crear usuario', err);

        const mensaje = err?.error?.mensaje || 'No fue posible crear el usuario.';
        this.mostrarToast(mensaje, 'error');

        this.cdr.detectChanges();
      }
    });
  }

  editarUsuario(usuario: any): void {
    this.usuarioEditando = usuario;

    this.nuevoUsuario = {
      nombre: usuario.nombre || '',
      password: '',
      rol: usuario.rol || ''
    };

    this.mostrarToast('Modo edición activado. Ingresa nueva contraseña solo si deseas cambiarla.', 'info');
    this.cdr.detectChanges();

    setTimeout(() => {
      const form = document.getElementById('formUsuario');

      if (form) {
        form.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
  }

  actualizarUsuario(): void {
    if (!this.usuarioEditando) {
      this.mostrarToast('No hay ningún usuario seleccionado para actualizar.', 'warning');
      return;
    }

    if (!this.formularioValidoParaActualizar()) {
      this.mostrarToast('Debes ingresar nombre y rol para actualizar.', 'warning');
      return;
    }

    const usuarioActualizado = {
      id: this.usuarioEditando.id,
      nombre: this.nuevoUsuario.nombre,
      password: this.nuevoUsuario.password,
      rol: this.nuevoUsuario.rol
    };

    this.usuarioService.actualizarUsuario(usuarioActualizado.id, usuarioActualizado).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.cancelarEdicionUsuario();

        this.mostrarToast('Usuario actualizado correctamente.', 'success');
        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Error al actualizar usuario', err);

        const mensaje = err?.error?.mensaje || 'No fue posible actualizar el usuario.';
        this.mostrarToast(mensaje, 'error');

        this.cdr.detectChanges();
      }
    });
  }

  eliminarUsuario(id: number): void {
    const confirmar = confirm('¿Seguro que deseas eliminar este usuario?');

    if (!confirmar) {
      return;
    }

    this.usuarioService.eliminarUsuario(id).subscribe({
      next: () => {
        this.cargarUsuarios();

        this.mostrarToast('Usuario eliminado correctamente.', 'success');
        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Error al eliminar usuario', err);

        const mensaje = err?.error?.mensaje || 'No fue posible eliminar el usuario.';
        this.mostrarToast(mensaje, 'error');

        this.cdr.detectChanges();
      }
    });
  }

  cancelarEdicionUsuario(): void {
    this.usuarioEditando = null;
    this.limpiarFormulario();
    this.cdr.detectChanges();
  }

  limpiarFormulario(): void {
    this.nuevoUsuario = {
      nombre: '',
      password: '',
      rol: ''
    };
  }

  formularioValidoParaCrear(): boolean {
    return !!(
      this.nuevoUsuario.nombre?.trim() &&
      this.nuevoUsuario.password?.trim() &&
      this.nuevoUsuario.rol?.trim()
    );
  }

  formularioValidoParaActualizar(): boolean {
    return !!(
      this.nuevoUsuario.nombre?.trim() &&
      this.nuevoUsuario.rol?.trim()
    );
  }

  obtenerUsuariosFiltrados(): any[] {
    const texto = this.busqueda.trim().toLowerCase();

    if (!texto) {
      return this.usuarios;
    }

    return this.usuarios.filter((usuario: any) => {
      const nombre = String(usuario.nombre || '').toLowerCase();
      const rol = String(usuario.rol || '').toLowerCase();
      const id = String(usuario.id || '').toLowerCase();

      return (
        nombre.includes(texto) ||
        rol.includes(texto) ||
        id.includes(texto)
      );
    });
  }

  contarPorRol(rol: string): number {
    return this.usuarios.filter((usuario: any) => usuario.rol === rol).length;
  }

  obtenerInicialUsuario(usuario: any): string {
    const nombre = usuario?.nombre || 'U';
    return nombre.charAt(0).toUpperCase();
  }

  obtenerRolFormateado(rol: string): string {
    if (rol === 'administrador') {
      return 'Administrador';
    }

    if (rol === 'empleado') {
      return 'Empleado';
    }

    if (rol === 'cliente') {
      return 'Cliente';
    }

    return 'Sin rol';
  }

  mostrarToast(
    mensaje: string,
    tipo: 'success' | 'error' | 'warning' | 'info' = 'info'
  ): void {
    this.toastMensaje = mensaje;
    this.toastTipo = tipo;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
      this.cdr.detectChanges();
    }, 4200);
  }
}
