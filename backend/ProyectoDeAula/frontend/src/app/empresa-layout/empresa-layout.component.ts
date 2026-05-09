import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-empresa-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './empresa-layout.component.html',
  styleUrls: ['./empresa-layout.component.css']
})
export class EmpresaLayoutComponent implements OnInit {

  usuarioLogueado: any = null;
  menuPerfilAbierto: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.cargarUsuarioLogueado();
  }

  cargarUsuarioLogueado(): void {
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

    if (usuarioGuardado) {
      this.usuarioLogueado = JSON.parse(usuarioGuardado);
    }
  }

  toggleMenuPerfil(): void {
    this.menuPerfilAbierto = !this.menuPerfilAbierto;
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuarioLogueado');
    this.router.navigate(['/']);
  }

  irAPersonas(): void {
    this.router.navigate(['/panel/dashboard']);
  }

  irLandingEmpresas(): void {
    this.router.navigate(['/empresas']);
  }

  obtenerInicialUsuario(): string {
    const nombre = this.usuarioLogueado?.nombre || 'E';
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

    return 'Usuario empresarial';
  }
}
