// Importa el decorador Component y la interfaz OnInit
import { Component, OnInit } from '@angular/core';

// Permite usar directivas como *ngIf, *ngFor y ngClass
import { CommonModule } from '@angular/common';

// Permite usar [(ngModel)] en inputs y selects
import { FormsModule } from '@angular/forms';

// Servicio para comunicarse con el backend
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class UsuariosComponent implements OnInit {

  // Lista de usuarios que vienen del backend
  usuarios: any[] = [];

  // Texto para filtrar usuarios
  busqueda: string = '';

  // Objeto usado por el formulario
  nuevoUsuario = {
    nombre: '',
    password: '',
    rol: ''
  };

  // Usuario seleccionado para edición
  usuarioEditando: any = null;

  // Toast visual
  toastVisible: boolean = false;
  toastMensaje: string = '';
  toastTipo: 'success' | 'error' | 'warning' | 'info' = 'info';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  // =============================
  // CARGAR USUARIOS
  // =============================

  cargarUsuarios(): void {

    const usuarioLogueado = JSON.parse(
      localStorage.getItem('usuarioLogueado') || '{}'
    );

    const rol = (
      usuarioLogueado?.rol ||
      usuarioLogueado?.tipoUsuario ||
      ''
    ).toUpperCase();

    // EMPRESA → solo sus usuarios
    if (rol === 'EMPRESA') {

      const empresaId = usuarioLogueado?.empresaId;

      if (!empresaId) {
        this.usuarios = [];
        return;
      }

      this.usuarioService.listarPorEmpresa(empresaId).subscribe({
        next: (data: any[]) => {
          this.usuarios = data || [];
        },
        error: (err: any) => {
          console.error('Error al cargar usuarios de empresa', err);
          this.mostrarToast(
            'No fue posible cargar los usuarios.',
            'error'
          );
        }
      });

      return;
    }

    // ADMIN → todos los usuarios
    this.usuarioService.listarUsuarios().subscribe({
      next: (data: any[]) => {
        this.usuarios = data || [];
      },
      error: (err: any) => {
        console.error('Error al cargar usuarios', err);
        this.mostrarToast(
          'No fue posible cargar los usuarios.',
          'error'
        );
      }
    });
  }

  // =============================
  // CREAR USUARIO
  // =============================

  crearUsuario(): void {
    if (
      !this.nuevoUsuario.nombre ||
      !this.nuevoUsuario.password ||
      !this.nuevoUsuario.rol
    ) {
      this.mostrarToast('Completa nombre, contraseña y rol.', 'warning');
      return;
    }

    const usuarioCrear = {
      nombre: this.nuevoUsuario.nombre.trim(),
      password: this.nuevoUsuario.password,
      rol: this.nuevoUsuario.rol
    };

    this.usuarioService.crearUsuario(usuarioCrear).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.limpiarFormulario();
        this.mostrarToast('Usuario creado correctamente.', 'success');
      },
      error: (err: any) => {
        console.error('Error al crear usuario', err);
        this.mostrarToast('No fue posible crear el usuario.', 'error');
      }
    });
  }

  // =============================
  // EDITAR USUARIO
  // =============================

  editarUsuario(usuario: any): void {
    this.usuarioEditando = usuario;

    this.nuevoUsuario = {
      nombre: usuario.nombre || '',
      password: '',
      rol: usuario.rol || ''
    };

    setTimeout(() => {
      const formulario = document.getElementById('formUsuario');

      if (formulario) {
        formulario.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
  }

  // =============================
  // ACTUALIZAR USUARIO
  // =============================

  actualizarUsuario(): void {
    if (!this.usuarioEditando) {
      this.mostrarToast('No hay un usuario seleccionado para actualizar.', 'warning');
      return;
    }

    if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.rol) {
      this.mostrarToast('Nombre y rol son obligatorios.', 'warning');
      return;
    }

    const usuarioActualizado: any = {
      id: this.usuarioEditando.id,
      nombre: this.nuevoUsuario.nombre.trim(),
      rol: this.nuevoUsuario.rol
    };

    // Si escribiste una nueva contraseña, se envía.
    // Si la dejaste vacía, no se cambia.
    if (this.nuevoUsuario.password && this.nuevoUsuario.password.trim() !== '') {
      usuarioActualizado.password = this.nuevoUsuario.password;
    }

    this.usuarioService.actualizarUsuario(usuarioActualizado.id, usuarioActualizado).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.cancelarEdicionUsuario();
        this.mostrarToast('Usuario actualizado correctamente.', 'success');
      },
      error: (err: any) => {
        console.error('Error al actualizar usuario', err);
        this.mostrarToast('No fue posible actualizar el usuario.', 'error');
      }
    });
  }

  // =============================
  // ELIMINAR USUARIO
  // =============================

  eliminarUsuario(id: number): void {
    const confirmar = confirm('¿Seguro que deseas eliminar este usuario?');

    if (!confirmar) {
      return;
    }

    this.usuarioService.eliminarUsuario(id).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.mostrarToast('Usuario eliminado correctamente.', 'success');
      },
      error: (err: any) => {
        console.error('Error al eliminar usuario', err);
        this.mostrarToast('No fue posible eliminar el usuario.', 'error');
      }
    });
  }

  // =============================
  // FORMULARIO
  // =============================

  cancelarEdicionUsuario(): void {
    this.usuarioEditando = null;
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.nuevoUsuario = {
      nombre: '',
      password: '',
      rol: ''
    };
  }

  // =============================
  // FILTROS Y UTILIDADES
  // =============================

  obtenerUsuariosFiltrados(): any[] {
    const texto = this.busqueda.trim().toLowerCase();

    if (!texto) {
      return this.usuarios;
    }

    return this.usuarios.filter((usuario: any) => {
      const id = String(usuario.id || '').toLowerCase();
      const nombre = String(usuario.nombre || '').toLowerCase();
      const rol = String(usuario.rol || '').toLowerCase();

      return (
        id.includes(texto) ||
        nombre.includes(texto) ||
        rol.includes(texto)
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

    if (rol === 'empresa') {
      return 'Empresa';
    }

    if (rol === 'empleado_empresa') {
      return 'Empleado empresa';
    }

    return 'Sin Rol';
  }

  // =============================
  // TOAST
  // =============================

  mostrarToast(
    mensaje: string,
    tipo: 'success' | 'error' | 'warning' | 'info' = 'info'
  ): void {
    this.toastMensaje = mensaje;
    this.toastTipo = tipo;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 4200);
  }
}
