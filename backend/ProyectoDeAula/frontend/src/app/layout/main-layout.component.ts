import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {

  usuarioLogueado: any = null;
  menuPerfilAbierto: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

    if (usuarioGuardado) {
      this.usuarioLogueado = JSON.parse(usuarioGuardado);
    }
  }

  irRuta(ruta: string): void {
    this.router.navigate([ruta]);
  }

  toggleMenuPerfil(): void {
    this.menuPerfilAbierto = !this.menuPerfilAbierto;
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuarioLogueado');
    this.router.navigate(['/']);
  }

  cambiarPassword(): void {
    alert('Aquí luego conectamos cambio de contraseña');
  }

  verInformacion(): void {
    if (this.esCliente()) {
      this.router.navigate(['/panel/mi-perfil']);
      this.menuPerfilAbierto = false;
      return;
    }

    alert('Información del usuario');
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
