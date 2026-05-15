import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent {

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  loginNombre: string = '';
  loginPassword: string = '';
  mensajeLogin: string = '';

  irALoginEmpresa(): void {
    const elemento = document.getElementById('loginEmpresaCard');

    if (elemento) {
      elemento.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  iniciarSesionEmpresa(): void {
    this.mensajeLogin = '';

    if (!this.loginNombre || !this.loginPassword) {
      this.mensajeLogin = 'Debes ingresar usuario y contraseña.';
      return;
    }

    const datosLogin = {
      nombre: this.loginNombre,
      password: this.loginPassword
    };

    this.usuarioService.login(datosLogin).subscribe({
      next: (usuario: any) => {
        if (!usuario) {
          this.mensajeLogin = 'Usuario o contraseña incorrectos.';
          return;
        }

        localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));

        if (usuario.rol === 'empresa') {
          this.router.navigate(['/empresa-panel/empleados']);
          return;
        }

        if (usuario.rol === 'empleado_empresa') {
          this.router.navigate(['/empresa-panel/mis-prestamos-empleado']);
          return;
        }

        this.mensajeLogin = 'Este acceso es solo para empresas o empleados empresariales.';
      },
      error: () => {
        this.mensajeLogin = 'No fue posible iniciar sesión.';
      }
    });
  }

  irAIngresarEmpresa(): void {
    localStorage.setItem('destinoLogin', 'empresa');

    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);

      if (usuario?.rol === 'empresa') {
        this.router.navigateByUrl('/empresa-panel/prestamos-empleados');
        return;
      }

      if (usuario?.rol === 'administrador' || usuario?.rol === 'empleado') {
        this.router.navigateByUrl('/panel/dashboard');
        return;
      }

      if (usuario?.rol === 'cliente') {
        this.router.navigateByUrl('/panel/mis-prestamos');
        return;
      }
    }

    this.router.navigateByUrl('/ingresar');
  }

  solicitarDemo(): void {
    alert('Solicitud de demo empresarial recibida. Próximamente se conectará con backend.');
  }

  verProductos(): void {
    alert('PrestaFácil Empresas es un software para que empresas administren préstamos internos a empleados.');
  }

  irAPersonas(): void {
    localStorage.removeItem('destinoLogin');
    this.router.navigateByUrl('/personas');
  }

  irAPagos(): void {
    alert('Los pagos de empleados estarán disponibles dentro del panel empresarial.');
  }

  irAtencion(): void {
    alert('Atención empresarial: soporte para empresas que usan PrestaFácil.');
  }
}
