import { Component, OnInit } from '@angular/core';
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

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.listarUsuarios().subscribe({
      next: (data: any[]) => {
        this.usuarios = data;
      },
      error: (err: any) => {
        console.error('Error al cargar usuarios', err);
      }
    });
  }

  crearUsuario(): void {
    if (
      !this.nuevoUsuario.nombre ||
      !this.nuevoUsuario.password ||
      !this.nuevoUsuario.rol
    ) {
      return;
    }

    this.usuarioService.crearUsuario(this.nuevoUsuario).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.limpiarFormulario();
      },
      error: (err: any) => {
        console.error('Error al crear usuario', err);
      }
    });
  }

  editarUsuario(usuario: any): void {
    this.usuarioEditando = usuario;

    this.nuevoUsuario = {
      nombre: usuario.nombre,
      password: '',
      rol: usuario.rol
    };
  }

  actualizarUsuario(): void {
    if (!this.usuarioEditando) {
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
      },
      error: (err: any) => {
        console.error('Error al actualizar usuario', err);
      }
    });
  }

  eliminarUsuario(id: number): void {
    this.usuarioService.eliminarUsuario(id).subscribe({
      next: () => {
        this.cargarUsuarios();
      },
      error: (err: any) => {
        console.error('Error al eliminar usuario', err);
      }
    });
  }

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
}
