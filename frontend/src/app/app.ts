import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService, Usuario } from './usuarios';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export default class App implements OnInit {
  usuarios: Usuario[] = [];

  nombre: string = '';
  password: string = '';
  rol: string = '';
  usuarioSeleccionado: any = null;

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuariosService.obtenerUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
      },
      error: (err: unknown) => {
        console.error('Error al cargar usuarios', err);
      },
    });
  }

  crearUsuario(): void {
    if (!this.nombre || !this.password || !this.rol) {
      alert('Todos los campos son obligatorios');
      return;
    }

    const nuevoUsuario: Usuario = {
      id: 0,
      nombre: this.nombre,
      password: this.password,
      rol: this.rol,
    };

    this.usuariosService.crearUsuario(nuevoUsuario).subscribe({
      next: (usuarioCreado: Usuario) => {
        this.usuarios.push(usuarioCreado);

        this.nombre = '';
        this.password = '';
        this.rol = '';
      },
      error: (err: unknown) => {
        console.error('Error al crear usuario', err);
      },
    });
  }
  eliminarUsuario(id: number): void {
    this.usuariosService.eliminarUsuario(id).subscribe({
      next: () => {
        console.log('Usuario eliminado');
        this.cargarUsuarios();
      },
      error: (err: unknown) => {
        console.error('Error al eliminar usuario', err);
      },
    });
  }
  seleccionarUsuario(usuario: any){
    this.usuarioSeleccionado = {...usuario}
  }
  cancelarEdicion(): void {
    this.usuarioSeleccionado = null;
    alert("Edicion cancelada")
  }
  actualizarUsuario(){
    this.usuariosService.actualizarUsuario(this.usuarioSeleccionado.id, this.usuarioSeleccionado)
      .subscribe(() =>{
        this.cargarUsuarios();
        this.usuarioSeleccionado = null;
      });

  }
}


