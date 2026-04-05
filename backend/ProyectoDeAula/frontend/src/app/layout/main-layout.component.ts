import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {
  usuarioLogueado: any = null;
  seccionActiva: string = '';
  menuPerfilAbierto: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuarioLogueado');
    if (usuario) {
      this.usuarioLogueado = JSON.parse(usuario);
    }
  }

  toggleSeccion(seccion: string): void {
    this.seccionActiva = this.seccionActiva === seccion ? '' : seccion;
  }

  toggleMenuPerfil(): void {
    this.menuPerfilAbierto = !this.menuPerfilAbierto;
  }

  irRuta(ruta: string): void {
    this.router.navigate([ruta]);
  }

  cambiarPassword(): void {
    alert('Aquí va cambiar contraseña');
  }

  verInformacion(): void {
    alert('Aquí va ver información');
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuarioLogueado');
    this.router.navigate(['/']);
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
