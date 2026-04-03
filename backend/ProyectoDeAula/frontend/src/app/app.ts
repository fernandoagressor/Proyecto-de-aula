import { Component, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';

import { UsuarioService } from './services/usuario.service';
import { Usuario } from './services/usuario';

import { UsuariosComponent } from './usuarios/usuarios';
import { ClientesComponent } from './clientes/clientes';
import {PrestamosComponent} from './prestamos/prestamos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, UsuariosComponent, ClientesComponent, UsuariosComponent, PrestamosComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  loginNombre: string = '';
  loginPassword: string = '';
  usuarioLogueado: Usuario | null = null;

  constructor(
    private usuarioService: UsuarioService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.recuperarSesion();
  }

  login(): void {
    const datos = {
      nombre: this.loginNombre,
      password: this.loginPassword
    };

    this.usuarioService.login(datos).subscribe({
      next: (respuesta: Usuario | null) => {
        if (respuesta) {
          this.usuarioLogueado = respuesta;

          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('usuarioLogueado', JSON.stringify(respuesta));
          }

          this.loginNombre = '';
          this.loginPassword = '';
          alert('Inicio de sesión correcto');
        } else {
          alert('Usuario o contraseña incorrectos');
        }
      },
      error: (err: any) => {
        console.error('Error en login', err);
        alert('Error al iniciar sesión');
      }
    });
  }

  logout(): void {
    this.usuarioLogueado = null;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('usuarioLogueado');
    }
  }

  recuperarSesion(): void {
    if (isPlatformBrowser(this.platformId)) {
      const usuarioGuardado = localStorage.getItem('usuarioLogueado');

      if (usuarioGuardado) {
        this.usuarioLogueado = JSON.parse(usuarioGuardado);
      }
    }
  }

  esAdmin(): boolean {
    return this.usuarioLogueado?.rol === 'administrador';
  }

  esEmpleado(): boolean {
    return this.usuarioLogueado?.rol === 'empleado';
  }
}
