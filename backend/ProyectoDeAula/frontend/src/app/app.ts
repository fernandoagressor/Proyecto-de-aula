import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// COMPONENTES
import { UsuariosComponent } from './usuarios/usuarios';
import { ClientesComponent } from './clientes/clientes';
import { PrestamosComponent } from './prestamos/prestamos';
import { DashboardComponent } from './dashboard/dashboard';
import { ConfiguracionComponent } from './configuracion/configuracion';
import { MiPerfilComponent } from './mi-perfil/mi-perfil';
import { MisPrestamosComponent } from './mis-prestamos/mis-prestamos';

// SERVICE
import { UsuarioService } from './services/usuario.service';
import { Usuario } from './services/usuario';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    // COMPONENTES
    UsuariosComponent,
    ClientesComponent,
    PrestamosComponent,
    DashboardComponent,
    ConfiguracionComponent,
    MiPerfilComponent,
    MisPrestamosComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  // LOGIN
  loginNombre: string = '';
  loginPassword: string = '';

  // SESIÓN
  usuarioLogueado: Usuario | null = null;
  mensajeLogin: string = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.recuperarSesion();
  }

  // 🔐 LOGIN
  iniciarSesion(): void {
    this.usuarioService.login({
      nombre: this.loginNombre,
      password: this.loginPassword
    }).subscribe({
      next: (usuario: Usuario) => {
        if (usuario) {
          this.usuarioLogueado = usuario;

          // guardar sesión
          localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));

          // limpiar
          this.mensajeLogin = '';
          this.loginNombre = '';
          this.loginPassword = '';

          // forzar recarga para que los componentes lean la sesión
          location.reload();

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

  // 🚪 LOGOUT
  cerrarSesion(): void {
    this.usuarioLogueado = null;
    localStorage.removeItem('usuarioLogueado');
  }

  // 🔄 RECUPERAR SESIÓN
  recuperarSesion(): void {
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

    if (usuarioGuardado) {
      this.usuarioLogueado = JSON.parse(usuarioGuardado);
    }
  }

  // 🔑 ROLES
  esAdmin(): boolean {
    return this.usuarioLogueado !== null &&
      this.usuarioLogueado.rol === 'administrador';
  }

  esEmpleado(): boolean {
    return this.usuarioLogueado !== null &&
      this.usuarioLogueado.rol === 'empleado';
  }

  esCliente(): boolean {
    return this.usuarioLogueado !== null &&
      this.usuarioLogueado.rol === 'cliente';
  }
}
