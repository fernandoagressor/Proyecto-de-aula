import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrestamoService } from '../services/prestamo.service';
import { Prestamo } from '../services/prestamo';
import { AbonoService } from '../services/abono.service';
import { Abono } from '../services/abono';

@Component({
  selector: 'app-mis-prestamos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-prestamos.html',
  styleUrls: ['./mis-prestamos.css']
})
export class MisPrestamosComponent implements OnInit {

  prestamos: Prestamo[] = [];
  usuarioLogueado: any = null;

  abonos: { [key: number]: string } = {};
  historialAbonos: Abono[] = [];
  prestamoSeleccionadoHistorial: number | null = null;
  mensaje: string = '';

  constructor(
    private prestamoService: PrestamoService,
    private abonoService: AbonoService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

    if (usuarioGuardado) {
      this.usuarioLogueado = JSON.parse(usuarioGuardado);

      if (this.usuarioLogueado.clienteId) {
        this.cargarMisPrestamos(this.usuarioLogueado.clienteId);
      }
    }
  }

  cargarMisPrestamos(clienteId: number): void {
    this.prestamoService.listarPorCliente(clienteId).subscribe({
      next: (data: Prestamo[]) => {
        this.prestamos = data;
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar mis préstamos', err);
      }
    });
  }

  abonarPrestamo(id: number): void {
    const valorAbono = this.abonos[id];

    if (!valorAbono || valorAbono.trim() === '') {
      this.mensaje = 'Debes escribir un valor para abonar';
      return;
    }

    const abonoNumero = Number(valorAbono);

    if (isNaN(abonoNumero) || abonoNumero <= 0) {
      this.mensaje = 'El abono debe ser mayor a 0';
      return;
    }

    this.prestamoService.abonarPrestamo(id, valorAbono).subscribe({
      next: () => {
        this.mensaje = 'Abono enviado. Queda pendiente de aprobación del administrador';
        this.abonos[id] = '';
        this.cargarMisPrestamos(this.usuarioLogueado.clienteId);
      },
      error: (err: any) => {
        console.error('Error al abonar préstamo', err);
        this.mensaje = err?.error?.message || 'No se pudo realizar el abono';
      }
    });
  }

  pagarTotal(prestamo: Prestamo): void {
    if (!this.puedeAbonar(prestamo.estado)) {
      return;
    }

    const saldoTotal = prestamo.saldoPendiente;

    this.prestamoService.abonarPrestamo(prestamo.id!, String(saldoTotal)).subscribe({
      next: () => {
        this.mensaje = 'Solicitud de pago total enviada. Queda pendiente de aprobación del administrador';
        this.abonos[prestamo.id!] = '';
        this.cargarMisPrestamos(this.usuarioLogueado.clienteId);
      },
      error: (err: any) => {
        console.error('Error al pagar total del préstamo', err);
        this.mensaje = err?.error?.message || 'No se pudo pagar el préstamo completo';
      }
    });
  }

  verHistorial(prestamoId: number): void {
    this.prestamoSeleccionadoHistorial = prestamoId;

    this.abonoService.listarAbonosPorPrestamo(prestamoId).subscribe({
      next: (data: Abono[]) => {
        this.historialAbonos = data;
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar historial de abonos', err);
      }
    });
  }

  puedeAbonar(estado: string): boolean {
    return estado === 'APROBADO';
  }

  calcularProgreso(prestamo: Prestamo): number {
    const total = prestamo.monto + (prestamo.monto * prestamo.interes);

    if (total <= 0) {
      return 0;
    }

    const pagado = total - prestamo.saldoPendiente;
    return Math.max(0, Math.min(100, (pagado / total) * 100));
  }

  formatearDinero(valor: number): string {
    return '$ ' + valor.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }
}
