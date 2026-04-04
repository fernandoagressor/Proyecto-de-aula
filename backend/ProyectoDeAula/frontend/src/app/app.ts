import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosComponent } from './usuarios/usuarios';
import { ClientesComponent } from './clientes/clientes';
import { PrestamosComponent } from './prestamos/prestamos';
import { DashboardComponent } from './dashboard/dashboard';
import { UsuarioService } from './services/usuario.service';
import { Usuario } from './services/usuario';
import {ConfiguracionComponent} from './configuracion/configuracion';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UsuariosComponent,
    ClientesComponent,
    PrestamosComponent,
    DashboardComponent,
    ConfiguracionComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  // 🔐 LOGIN
  loginNombre: string = '';
  loginPassword: string = '';

  usuarioLogueado: Usuario | null = null;
  mensajeLogin: string = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.recuperarSesion();
  }

  // 🚀 LOGIN REAL
  iniciarSesion(): void {
    this.usuarioService.login({
      nombre: this.loginNombre,
      password: this.loginPassword
    }).subscribe({
      next: (usuario: Usuario) => {
        if (usuario) {
          this.usuarioLogueado = usuario;

          // Guardar sesión
          if (typeof window !== 'undefined') {
            localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
          }

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

  // 🚪 CERRAR SESIÓN
  cerrarSesion(): void {
    this.usuarioLogueado = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('usuarioLogueado');
    }
  }

  // 🔁 RECUPERAR SESIÓN
  recuperarSesion(): void {
    if (typeof window !== 'undefined') {
      const usuarioGuardado = localStorage.getItem('usuarioLogueado');

      if (usuarioGuardado) {
        this.usuarioLogueado = JSON.parse(usuarioGuardado);
      }
    }
  }

  // 🔐 ROLES
  esAdmin(): boolean {
    return this.usuarioLogueado !== null &&
      this.usuarioLogueado.rol === 'administrador';
  }

  esEmpleado(): boolean {
    return this.usuarioLogueado !== null &&
      this.usuarioLogueado.rol === 'empleado';
  }

}
