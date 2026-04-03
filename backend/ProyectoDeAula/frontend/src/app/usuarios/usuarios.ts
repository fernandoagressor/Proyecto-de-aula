import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../services/usuario';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];

  nuevoUsuario: Usuario = {
    nombre: '',
    password: '',
    rol: ''
  };

  usuarioSeleccionado: Usuario | null = null;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.usuarioService.listarUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
      },
      error: (err: any) => {
        console.error('Error al obtener usuarios', err);
      }
    });
  }

  crearUsuario(): void {
    this.usuarioService.crearUsuario(this.nuevoUsuario).subscribe({
      next: () => {
        this.obtenerUsuarios();
        this.nuevoUsuario = {
          nombre: '',
          password: '',
          rol: ''
        };
      },
      error: (err: any) => {
        console.error('Error al crear usuario', err);
      }
    });
  }

  seleccionarUsuario(usuario: Usuario): void {
    this.usuarioSeleccionado = { ...usuario };
  }

  actualizarUsuario(): void {
    if (!this.usuarioSeleccionado || this.usuarioSeleccionado.id == null) {
      return;
    }

    this.usuarioService.actualizarUsuario(this.usuarioSeleccionado.id, this.usuarioSeleccionado).subscribe({
      next: () => {
        this.obtenerUsuarios();
        this.usuarioSeleccionado = null;
      },
      error: (err: any) => {
        console.error('Error al actualizar usuario', err);
      }
    });
  }

  eliminarUsuario(id: number): void {
    this.usuarioService.eliminarUsuario(id).subscribe({
      next: () => {
        this.obtenerUsuarios();
      },
      error: (err: any) => {
        console.error('Error al eliminar usuario', err);
      }
    });
  }

  cancelarEdicionUsuario(): void {
    this.usuarioSeleccionado = null;
  }
}
