import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {

  usuarioLogueado: any = null;

  menuPerfilAbierto: boolean = false;
  notificacionesAbiertas: boolean = false;

  notificaciones: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.cargarUsuarioLogueado();
    this.cargarNotificacionesDemo();
  }

  cargarUsuarioLogueado(): void {
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

    if (usuarioGuardado) {
      this.usuarioLogueado = JSON.parse(usuarioGuardado);
    }
  }

  cargarNotificacionesDemo(): void {
    if (this.esAdmin() || this.esEmpleado()) {
      this.notificaciones = [
        {
          icono: '💰',
          titulo: 'Nueva solicitud',
          mensaje: 'Hay solicitudes de préstamo pendientes por revisar.'
        },
        {
          icono: '⏳',
          titulo: 'Abonos pendientes',
          mensaje: 'Existen pagos esperando aprobación administrativa.'
        },
        {
          icono: '📊',
          titulo: 'Resumen actualizado',
          mensaje: 'El dashboard financiero ya está disponible.'
        }
      ];

      return;
    }

    if (this.esCliente()) {
      this.notificaciones = [
        {
          icono: '💳',
          titulo: 'Mis préstamos',
          mensaje: 'Consulta tu saldo, cuotas y estado actualizado.'
        },
        {
          icono: '🧾',
          titulo: 'Comprobantes',
          mensaje: 'Próximamente podrás descargar tus recibos en PDF.'
        }
      ];
    }
  }

  toggleMenuPerfil(): void {
    this.menuPerfilAbierto = !this.menuPerfilAbierto;

    if (this.menuPerfilAbierto) {
      this.notificacionesAbiertas = false;
    }
  }

  toggleNotificaciones(): void {
    this.notificacionesAbiertas = !this.notificacionesAbiertas;

    if (this.notificacionesAbiertas) {
      this.menuPerfilAbierto = false;
    }
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuarioLogueado');
    this.router.navigate(['/']);
  }

  cambiarPassword(): void {
    alert('Aquí luego conectamos cambio de contraseña.');
    this.menuPerfilAbierto = false;
  }

  verInformacion(): void {
    if (this.esCliente()) {
      this.router.navigate(['/panel/mi-perfil']);
      this.menuPerfilAbierto = false;
      return;
    }

    alert('Información del usuario.');
    this.menuPerfilAbierto = false;
  }

  obtenerInicialUsuario(): string {
    const nombre = this.usuarioLogueado?.nombre || 'U';
    return nombre.charAt(0).toUpperCase();
  }

  obtenerRolFormateado(): string {
    const rol = this.usuarioLogueado?.rol || '';

    if (rol === 'administrador') {
      return 'Administrador';
    }

    if (rol === 'empleado') {
      return 'Empleado';
    }

    if (rol === 'cliente') {
      return 'Cliente';
    }

    return 'Usuario';
  }

  esAdmin(): boolean {
    return this.usuarioLogueado?.rol === 'administrador';
  }

  esEmpleado(): boolean {
    return this.usuarioLogueado?.rol === 'empleado';
  }

  esCliente(): boolean {
    return this.usuarioLogueado?.rol === 'cliente';
  }
}
