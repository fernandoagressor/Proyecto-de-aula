import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {

  loginNombre: string = '';
  loginPassword: string = '';
  mensajeLogin: string = '';

  recordarUsuario: boolean = false;
  mostrarPassword: boolean = false;

  ayudaAbierta: boolean = false;
  modalRecuperacionAbierto: boolean = false;
  modalRegistroAbierto: boolean = false;

  correoRecuperacion: string = '';

  seccionActiva: 'personas' | 'empresas' | 'productos' | 'pagos' | 'atencion' | 'login' = 'personas';

  menuProductosAbierto: boolean = false;
  menuPagosAbierto: boolean = false;
  menuAtencionAbierto: boolean = false;

  toastVisible: boolean = false;
  toastMensaje: string = '';
  toastTipo: 'info' | 'error' | 'success' | 'warning' = 'info';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const usuarioRecordado = localStorage.getItem('usuarioRecordado');

    if (usuarioRecordado) {
      this.loginNombre = usuarioRecordado;
      this.recordarUsuario = true;
    }

    const destinoLogin = localStorage.getItem('destinoLogin');

    if (destinoLogin === 'empresa') {
      this.seccionActiva = 'empresas';
    }
  }

  // =============================
  // MENÚ PRINCIPAL
  // =============================

  irPersonas(): void {
    this.seccionActiva = 'personas';
    this.cerrarMenus();
    this.router.navigate(['/personas']);
    this.mostrarToast('Estás en la sección de préstamos para personas.', 'info');
  }

  irEmpresas(): void {
    this.seccionActiva = 'empresas';
    this.cerrarMenus();
    this.router.navigate(['/empresas']);
    this.mostrarToast('Sección empresas: préstamos empresariales para empleados.', 'info');
  }

  toggleProductos(): void {
    this.menuProductosAbierto = !this.menuProductosAbierto;
    this.menuPagosAbierto = false;
    this.menuAtencionAbierto = false;
    this.seccionActiva = 'productos';
  }

  togglePagos(): void {
    this.menuPagosAbierto = !this.menuPagosAbierto;
    this.menuProductosAbierto = false;
    this.menuAtencionAbierto = false;
    this.seccionActiva = 'pagos';
  }

  toggleAtencion(): void {
    this.menuAtencionAbierto = !this.menuAtencionAbierto;
    this.menuProductosAbierto = false;
    this.menuPagosAbierto = false;
    this.seccionActiva = 'atencion';
  }

  irAIngresar(): void {
    this.seccionActiva = 'login';
    this.cerrarMenus();
    this.router.navigate(['/ingresar']);
    this.irALogin();
  }

  cerrarMenus(): void {
    this.menuProductosAbierto = false;
    this.menuPagosAbierto = false;
    this.menuAtencionAbierto = false;
  }

  // =============================
  // ACCIONES PRODUCTOS
  // =============================

  abrirProducto(tipo: string): void {
    this.cerrarMenus();

    if (tipo === 'personales') {
      this.mostrarToast('Préstamos personales: solicita, consulta y paga tus créditos.', 'info');
      this.seccionActiva = 'personas';
      return;
    }

    if (tipo === 'empresariales') {
      this.mostrarToast('Préstamos empresariales: financiación para empleados de empresas aliadas.', 'info');
      this.seccionActiva = 'empresas';
      this.router.navigate(['/empresas']);
      return;
    }

    if (tipo === 'simulador') {
      this.mostrarToast('Próximamente conectaremos un simulador de crédito.', 'warning');
      return;
    }

    if (tipo === 'comprobantes') {
      this.mostrarToast('Los comprobantes estarán disponibles al iniciar sesión.', 'info');
      this.irAIngresar();
    }
  }

  // =============================
  // ACCIONES PAGOS
  // =============================

  abrirPago(tipo: string): void {
    this.cerrarMenus();

    if (tipo === 'pse') {
      this.mostrarToast('Para pagar por PSE debes iniciar sesión como cliente.', 'info');
      this.irAIngresar();
      return;
    }

    if (tipo === 'historial') {
      this.mostrarToast('El historial de pagos está disponible dentro del panel del cliente.', 'info');
      this.irAIngresar();
      return;
    }

    if (tipo === 'comprobante') {
      this.mostrarToast('Para consultar comprobantes debes ingresar al sistema.', 'info');
      this.irAIngresar();
    }
  }

  // =============================
  // ACCIONES ATENCIÓN
  // =============================

  abrirAtencion(tipo: string): void {
    this.cerrarMenus();

    if (tipo === 'ayuda') {
      this.ayudaAbierta = true;
      this.mostrarToast('Centro de ayuda abierto.', 'info');
      return;
    }

    if (tipo === 'preguntas') {
      this.mostrarToast('Preguntas frecuentes: préstamos, pagos PSE, comprobantes y solicitudes.', 'info');
      return;
    }

    if (tipo === 'contacto') {
      this.mostrarToast('Soporte PrestaFácil: soporte@prestafacil.com - Línea: 018000 123 456', 'info');
      return;
    }

    if (tipo === 'soporte') {
      this.ayudaAbierta = true;
      this.mostrarToast('Un asesor simulado te guiará con el acceso al sistema.', 'info');
    }
  }

  // =============================
  // AYUDA
  // =============================

  abrirCerrarAyuda(): void {
    this.ayudaAbierta = !this.ayudaAbierta;
  }

  cerrarAyuda(): void {
    this.ayudaAbierta = false;
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

  // =============================
  // LOGIN
  // =============================

  irALogin(): void {
    const elemento = document.getElementById('loginCard');

    if (elemento) {
      elemento.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  alternarMostrarPassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  iniciarSesion(): void {
    this.mensajeLogin = '';

    if (!this.loginNombre || !this.loginPassword) {
      this.mensajeLogin = 'Debes ingresar usuario y contraseña para continuar.';
      this.mostrarToast(this.mensajeLogin, 'warning');
      return;
    }

    const datosLogin = {
      nombre: this.loginNombre.trim(),
      password: this.loginPassword
    };

    this.usuarioService.login(datosLogin).subscribe({

      next: (usuario: any) => {

        if (!usuario) {
          this.mensajeLogin = 'Usuario o contraseña incorrectos. Verifica tus datos e intenta nuevamente.';
          this.mostrarToast(this.mensajeLogin, 'error');
          return;
        }

        if (this.recordarUsuario) {
          localStorage.setItem('usuarioRecordado', this.loginNombre.trim());
        } else {
          localStorage.removeItem('usuarioRecordado');
        }

        localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));

        this.mostrarToast('Inicio de sesión exitoso. Redirigiendo...', 'success');

        setTimeout(() => {
          const destinoLogin = localStorage.getItem('destinoLogin');

          if (destinoLogin === 'empresa') {
            localStorage.removeItem('destinoLogin');

            if (usuario.rol === 'administrador' || usuario.rol === 'empleado') {
              this.router.navigate(['/empresa-panel/empresas']);
              return;
            }

            this.mensajeLogin = 'Tu usuario no tiene permisos para ingresar al panel empresarial.';
            this.mostrarToast(this.mensajeLogin, 'error');
            return;
          }

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

  // =============================
  // RECUPERAR CONTRASEÑA
  // =============================

  abrirRecuperacion(): void {
    this.modalRecuperacionAbierto = true;
    this.cerrarMenus();
  }

  cerrarRecuperacion(): void {
    this.modalRecuperacionAbierto = false;
    this.correoRecuperacion = '';
  }

  enviarRecuperacion(): void {
    if (!this.correoRecuperacion || !this.correoRecuperacion.includes('@')) {
      this.mostrarToast('Ingresa un correo válido para recuperar tu contraseña.', 'warning');
      return;
    }

    this.mostrarToast(
      'Solicitud enviada. Si el correo está registrado, recibirás instrucciones de recuperación.',
      'success'
    );

    this.cerrarRecuperacion();
  }

  // =============================
  // REGISTRO / CUENTA NUEVA SIMULADA
  // =============================

  abrirRegistroCliente(): void {
    this.modalRegistroAbierto = true;
    this.cerrarMenus();
  }

  cerrarRegistroCliente(): void {
    this.modalRegistroAbierto = false;
  }

  solicitarCuentaCliente(): void {
    this.mostrarToast(
      'Solicitud recibida. Un administrador deberá crear tu usuario cliente desde el panel.',
      'success'
    );

    this.cerrarRegistroCliente();
  }

  // =============================
  // TOAST
  // =============================

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
}
