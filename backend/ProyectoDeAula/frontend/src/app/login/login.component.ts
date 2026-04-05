import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginNombre: string = '';
  loginPassword: string = '';
  mensajeLogin: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  iniciarSesion(): void {
    if (!this.loginNombre || !this.loginPassword) {
      this.mensajeLogin = 'Completa todos los campos';
      return;
    }

    this.usuarioService.login({
      nombre: this.loginNombre,
      password: this.loginPassword
    }).subscribe({
      next: (usuario: any) => {
        if (usuario) {
          localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));

          if (usuario.rol === 'cliente') {
            this.router.navigate(['/panel/mis-prestamos']);
          } else {
            this.router.navigate(['/panel/dashboard']);
          }
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
}
