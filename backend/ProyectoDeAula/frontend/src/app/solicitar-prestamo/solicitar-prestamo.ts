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

    if (!usuario.clienteId) {
      this.mensaje = 'No se encontró el cliente asociado';
      return;
    }

    if (!this.monto || !this.plazoMeses) {
      this.mensaje = 'Completa todos los campos';
      return;
    }

    if (Number(this.monto) <= 0 || Number(this.plazoMeses) <= 0) {
      this.mensaje = 'El monto y el plazo deben ser mayores a 0';
      return;
    }

    this.prestamoService.solicitarPrestamo({
      clienteId: String(usuario.clienteId),
      monto: this.monto,
      plazoMeses: this.plazoMeses
    }).subscribe({
      next: () => {
        this.mensaje = 'Solicitud enviada correctamente';
        this.monto = '';
        this.plazoMeses = '';
      },
      error: (err: any) => {
        console.error('Error al solicitar préstamo', err);
        this.mensaje = err?.error?.message || 'No se pudo enviar la solicitud';
      }
    });
  }
}
