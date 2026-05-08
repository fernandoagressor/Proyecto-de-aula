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
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginNombre: string = '';
  loginPassword: string = '';
  mensajeLogin: string = '';

  ayudaAbierta: boolean = false;

  toastVisible: boolean = false;
  toastMensaje: string = '';
  toastTipo: 'info' | 'error' | 'success' | 'warning' = 'info';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  abrirCerrarAyuda(): void {
    this.ayudaAbierta = !this.ayudaAbierta;
  }

  cerrarAyuda(): void {
    this.ayudaAbierta = false;
  }

  irALogin(): void {
    const elemento = document.getElementById('loginCard');

    if (elemento) {
      elemento.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  mostrarToast(
    mensaje: string,
    tipo: 'info' | 'error' | 'success' | 'warning' = 'info'
  ): void {
    this.toastMensaje = mensaje;
    this.toastTipo = tipo;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 4200);
  }

  mostrarAyuda(mensaje: string): void {
    this.mensajeLogin = mensaje;
    this.ayudaAbierta = false;
    this.mostrarToast(mensaje, 'info');
    this.irALogin();
  }

  abrirSolicitudAcceso(): void {
    const mensaje = 'Para solicitar acceso, comunícate con soporte o con el administrador del sistema.';

    this.ayudaAbierta = true;
    this.mensajeLogin = mensaje;
    this.mostrarToast(mensaje, 'warning');
    this.irALogin();
  }

  iniciarSesion(): void {

    this.mensajeLogin = '';

    if (!this.loginNombre || !this.loginPassword) {
      this.mensajeLogin = 'Debes ingresar usuario y contraseña para continuar.';
      this.mostrarToast(this.mensajeLogin, 'warning');
      return;
    }

    const datosLogin = {
      nombre: this.loginNombre,
      password: this.loginPassword
    };

    this.usuarioService.login(datosLogin).subscribe({

      next: (usuario: any) => {

        if (!usuario) {
          this.mensajeLogin = 'Usuario o contraseña incorrectos. Verifica tus datos e intenta nuevamente.';
          this.mostrarToast(this.mensajeLogin, 'error');
          return;
        }

        localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));

        this.mostrarToast('Inicio de sesión exitoso. Redirigiendo...', 'success');

        setTimeout(() => {
          if (usuario.rol === 'administrador' || usuario.rol === 'empleado') {
            this.router.navigate(['/panel/dashboard']);
            return;
          }

          if (usuario.rol === 'cliente') {
            this.router.navigate(['/panel/mis-prestamos']);
            return;
          }

          this.mensajeLogin = 'El usuario no tiene un rol válido asignado.';
          this.mostrarToast(this.mensajeLogin, 'error');
        }, 700);
      },

      error: (error: any) => {
        console.error('Error al iniciar sesión', error);

        if (error?.error?.mensaje) {
          this.mensajeLogin = error.error.mensaje;
          this.mostrarToast(this.mensajeLogin, 'error');
          return;
        }

        this.mensajeLogin = 'No fue posible iniciar sesión. Verifica tus datos e intenta nuevamente.';
        this.mostrarToast(this.mensajeLogin, 'error');
      }
    });
  }
}
