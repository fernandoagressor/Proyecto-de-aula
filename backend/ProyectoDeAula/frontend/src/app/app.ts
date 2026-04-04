import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosComponent } from './usuarios/usuarios';
import { ClientesComponent } from './clientes/clientes';
import { PrestamosComponent } from './prestamos/prestamos';
import { UsuarioService } from './services/usuario.service';
import { Usuario } from './services/usuario';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UsuariosComponent,
    ClientesComponent,
    PrestamosComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  loginNombre: string = '';
  loginPassword: string = '';

  usuarioLogueado: Usuario | null = null;
  mensajeLogin: string = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.recuperarSesion();
  }

  iniciarSesion(): void {
    this.usuarioService.login({
      nombre: this.loginNombre,
      password: this.loginPassword
    }).subscribe({
      next: (usuario: Usuario) => {
        if (usuario) {
          this.usuarioLogueado = usuario;
          localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
          this.mensajeLogin = '';
          this.loginNombre = '';
          this.loginPassword = '';
        } else {
          this.mensajeLogin = 'Usuario o contraseña incorrectos';
        }
      },
      error: (err: any) => {
        console.error('Error en login', err);
        this.mensajeLogin = 'Error al iniciar sesión';
      }
    });
  }

  cerrarSesion(): void {
    this.usuarioLogueado = null;
    localStorage.removeItem('usuarioLogueado');
  }

  recuperarSesion(): void {
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

    if (usuarioGuardado) {
      this.usuarioLogueado = JSON.parse(usuarioGuardado);
    }
  }

  esAdmin(): boolean {
    return this.usuarioLogueado !== null && this.usuarioLogueado.rol === 'administrador';
  }

  esEmpleado(): boolean {
    return this.usuarioLogueado !== null && this.usuarioLogueado.rol === 'empleado';
  }
}
