// Importa decorador Component
import { Component } from '@angular/core';

// Permite usar *ngIf, *ngFor
import { CommonModule } from '@angular/common';

// Permite usar [(ngModel)] en inputs
import { FormsModule } from '@angular/forms';

// Router → para navegar entre páginas
import { Router } from '@angular/router';

// Servicio que conecta con el backend
import { UsuarioService } from '../services/usuario.service';


// Decorador del componente
@Component({

  // Nombre del componente en HTML
  selector: 'app-login',

  // Componente standalone
  standalone: true,

  // Módulos que puede usar
  imports: [CommonModule, FormsModule],

  // HTML asociado
  templateUrl: './login.component.html',

  // CSS asociado
  styleUrl: './login.component.css'
})

// Clase del componente
export class LoginComponent {

  // Variable para guardar el usuario ingresado
  loginNombre: string = '';

  // Variable para guardar la contraseña
  loginPassword: string = '';

  // Mensaje de error o estado
  mensajeLogin: string = '';

  // Constructor con inyección de dependencias
  constructor(
    private usuarioService: UsuarioService, // Servicio backend
    private router: Router // Navegación
  ) {}

  // Método que se ejecuta al hacer clic en "Ingresar"
  iniciarSesion(): void {

    // Validación: campos vacíos
    if (!this.loginNombre || !this.loginPassword) {

      // Muestra mensaje
      this.mensajeLogin = 'Completa todos los campos';

      return; // Detiene ejecución
    }

    // Llama al backend (HTTP POST)
    this.usuarioService.login({
      nombre: this.loginNombre,
      password: this.loginPassword
    }).subscribe({

      // Si el backend responde
      next: (usuario: any) => {

        // Si existe el usuario
        if (usuario) {

          // Guarda usuario en el navegador (sesión)
          localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));

          // Redirección según rol
          if (usuario.rol === 'cliente') {

            // Va a préstamos del cliente
            this.router.navigate(['/panel/mis-prestamos']);

          } else {

            // Va al dashboard general
            this.router.navigate(['/panel/dashboard']);
          }

        } else {

          // Si no existe usuario
          this.mensajeLogin = 'Usuario o contraseña incorrectos';
        }
      },

      // Si ocurre error en backend
      error: (err: any) => {

        console.error('Error en login', err);

        this.mensajeLogin = 'Error al iniciar sesión';
      }
    });
  }
}
