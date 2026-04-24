// Importa Component y OnInit
// Component → define el componente
// OnInit → ejecuta código al iniciar
import { Component, OnInit } from '@angular/core';

// Permite usar *ngIf, *ngFor
import { CommonModule } from '@angular/common';

// Router → permite navegar entre páginas
// RouterOutlet → muestra las vistas dinámicamente
import { Router, RouterOutlet } from '@angular/router';


// Decorador del componente
@Component({

  // Nombre del componente en HTML
  selector: 'app-main-layout',

  // Componente standalone
  standalone: true,

  // Módulos que puede usar
  imports: [CommonModule, RouterOutlet],

  // HTML asociado
  templateUrl: './main-layout.component.html',

  // CSS asociado
  styleUrls: ['./main-layout.component.css']
})

// Clase principal
export class MainLayoutComponent implements OnInit {

  // Variable donde se guarda el usuario logueado
  usuarioLogueado: any = null;

  // Controla si el menú del perfil está abierto o cerrado
  menuPerfilAbierto: boolean = false;

  // Constructor con router
  constructor(private router: Router) {}

  // Método que se ejecuta al iniciar el componente
  ngOnInit(): void {

    // Obtiene el usuario guardado en el navegador
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

    // Si existe
    if (usuarioGuardado) {

      // Lo convierte de JSON a objeto
      this.usuarioLogueado = JSON.parse(usuarioGuardado);
    }
  }

  // Método para navegar entre rutas
  irRuta(ruta: string): void {

    // Redirige a la ruta indicada
    this.router.navigate([ruta]);
  }

  // Abre o cierra el menú de perfil
  toggleMenuPerfil(): void {

    // Invierte el valor (true/false)
    this.menuPerfilAbierto = !this.menuPerfilAbierto;
  }

  // Cerrar sesión
  cerrarSesion(): void {

    // Elimina el usuario del navegador
    localStorage.removeItem('usuarioLogueado');

    // Redirige al login
    this.router.navigate(['/']);
  }

  // Cambio de contraseña (simulado)
  cambiarPassword(): void {

    // Mensaje temporal
    alert('Aquí luego conectamos cambio de contraseña');
  }

  // Ver información del usuario
  verInformacion(): void {

    // Si es cliente
    if (this.esCliente()) {

      // Va al perfil
      this.router.navigate(['/panel/mi-perfil']);

      // Cierra menú
      this.menuPerfilAbierto = false;

      return;
    }

    // Si no es cliente
    alert('Información del usuario');
  }

  // Verifica si es administrador
  esAdmin(): boolean {

    // Retorna true si el rol es administrador
    return this.usuarioLogueado?.rol === 'administrador';
  }

  // Verifica si es empleado
  esEmpleado(): boolean {

    return this.usuarioLogueado?.rol === 'empleado';
  }

  // Verifica si es cliente
  esCliente(): boolean {

    return this.usuarioLogueado?.rol === 'cliente';
  }
}
