import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

import { NotificacionService, Notificacion } from '../services/notificacion.service';

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

  notificaciones: Notificacion[] = [];
  totalNoLeidas: number = 0;
  cargandoNotificaciones: boolean = false;

  constructor(
    private router: Router,
    private notificacionService: NotificacionService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarUsuarioLogueado();

    if (this.puedeVerNotificaciones()) {
      this.cargarNotificaciones();
    }
  }

  cargarUsuarioLogueado(): void {
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

    if (usuarioGuardado) {
      this.usuarioLogueado = JSON.parse(usuarioGuardado);
    }
  }

  cargarNotificaciones(): void {
    if (!this.puedeVerNotificaciones()) {
      this.notificaciones = [];
      this.totalNoLeidas = 0;
      this.cargandoNotificaciones = false;
      this.cd.detectChanges();
      return;
    }

    const rol = this.usuarioLogueado?.rol;

    if (!rol) {
      this.notificaciones = [];
      this.totalNoLeidas = 0;
      this.cargandoNotificaciones = false;
      this.cd.detectChanges();
      return;
    }

    this.cargandoNotificaciones = true;
    this.cd.detectChanges();

    this.notificacionService.listarPorRol(rol).subscribe({
      next: (data: Notificacion[]) => {
        this.notificaciones = data || [];
        this.totalNoLeidas = this.notificaciones.filter((n: Notificacion) => !n.leida).length;
      },
      error: (err: any) => {
        console.error('Error cargando notificaciones', err);
        this.notificaciones = [];
        this.totalNoLeidas = 0;
      },
      complete: () => {
        this.cargandoNotificaciones = false;
        this.cd.detectChanges();
      }
    });

    // Seguro extra para que nunca quede pegado en "Cargando..."
    setTimeout(() => {
      this.cargandoNotificaciones = false;
      this.cd.detectChanges();
    }, 1200);
  }

  puedeVerNotificaciones(): boolean {
    return this.esAdmin() || this.esEmpleado();
  }

  cantidadNotificacionesNoLeidas(): number {
    return this.totalNoLeidas;
  }

  marcarNotificacionesComoLeidas(): void {
    if (!this.puedeVerNotificaciones()) {
      return;
    }

    const rol = this.usuarioLogueado?.rol;

    if (!rol) {
      return;
    }

    this.notificacionService.marcarComoLeidas(rol).subscribe({
      next: () => {
        this.cargarNotificaciones();
      },
      error: (err: any) => {
        console.error('Error marcando notificaciones como leídas', err);
      }
    });
  }

  toggleMenuPerfil(): void {
    this.menuPerfilAbierto = !this.menuPerfilAbierto;

    if (this.menuPerfilAbierto) {
      this.notificacionesAbiertas = false;
    }
  }

  toggleNotificaciones(): void {
    if (!this.puedeVerNotificaciones()) {
      return;
    }

    this.notificacionesAbiertas = !this.notificacionesAbiertas;

    if (this.notificacionesAbiertas) {
      this.menuPerfilAbierto = false;
      this.cargarNotificaciones();
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
    if (rol === 'empresa') {
      return 'Empresa';
    }

    if (rol === 'cliente') {
      return 'Cliente';
    }

    return 'Usuario';
  }

  formatearFecha(fecha: string): string {
    if (!fecha) {
      return 'Sin fecha';
    }

    const fechaObj = new Date(fecha);

    return fechaObj.toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
