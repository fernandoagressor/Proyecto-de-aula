import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PrestamoService } from '../services/prestamo.service';

@Component({
  selector: 'app-solicitar-prestamo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitar-prestamo.html',
  styleUrls: ['./solicitar-prestamo.css']
})
export class SolicitarPrestamoComponent {

  monto: string = '';
  plazoMeses: string = '';
  mensaje: string = '';

  constructor(private prestamoService: PrestamoService) {}

  solicitarPrestamo(): void {

    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

    if (!usuarioGuardado) {
      this.mensaje = 'No hay sesión activa';
      return;
    }

    const usuario = JSON.parse(usuarioGuardado);
    const rol = usuario?.rol;

    // Validaciones
    if (!this.monto || !this.plazoMeses) {
      this.mensaje = 'Completa todos los campos';
      return;
    }

    if (Number(this.monto) <= 0 || Number(this.plazoMeses) <= 0) {
      this.mensaje = 'El monto y el plazo deben ser mayores a 0';
      return;
    }

    // =============================
    // CLIENTE
    // =============================
    if (rol === 'cliente') {

      if (!usuario.clienteId) {
        this.mensaje = 'No se encontró el cliente asociado';
        return;
      }

      this.prestamoService.solicitarPrestamo({
        clienteId: String(usuario.clienteId),
        monto: this.monto,
        plazoMeses: this.plazoMeses
      }).subscribe({

        next: () => {
          this.mensaje = 'Solicitud enviada correctamente';
          this.limpiarFormulario();
        },

        error: (err: any) => {
          console.error('Error al solicitar préstamo cliente', err);

          this.mensaje =
            err?.error?.message ||
            'No se pudo enviar la solicitud';
        }
      });

      return;
    }

    // =============================
    // EMPLEADO EMPRESA
    // =============================
    if (rol === 'empleado_empresa') {

      const empleadoId = usuario?.empleadoId;
      const empresaId = usuario?.empresaId;

      if (!empleadoId || !empresaId) {
        this.mensaje = 'No se encontró la información del empleado';
        return;
      }

      this.prestamoService.solicitarPrestamoEmpleado({
        empleadoId: String(empleadoId),
        empresaId: String(empresaId),
        monto: this.monto,
        plazoMeses: this.plazoMeses
      }).subscribe({

        next: () => {
          this.mensaje = 'Solicitud enviada correctamente';
          this.limpiarFormulario();
        },

        error: (err: any) => {
          console.error('Error al solicitar préstamo empleado', err);

          this.mensaje =
            err?.error?.message ||
            'No se pudo enviar la solicitud';
        }
      });

      return;
    }

    this.mensaje = 'Tu rol no tiene permisos para solicitar préstamos';
  }

  esEmpleadoEmpresa(): boolean {

    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

    if (!usuarioGuardado) {
      return false;
    }

    const usuario = JSON.parse(usuarioGuardado);

    return usuario?.rol === 'empleado_empresa';
  }

  esCliente(): boolean {

    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

    if (!usuarioGuardado) {
      return false;
    }

    const usuario = JSON.parse(usuarioGuardado);

    return usuario?.rol === 'cliente';
  }

  limpiarFormulario(): void {
    this.monto = '';
    this.plazoMeses = '';
  }
}
