import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AbonoService } from '../services/abono.service';
import { PrestamoService } from '../services/prestamo.service';
import { Abono } from '../services/abono';

@Component({
  selector: 'app-abonos-pendientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './abonos-pendientes.html',
  styleUrls: ['./abonos-pendientes.css']
})
export class AbonosPendientesComponent implements OnInit {

  abonosPendientes: Abono[] = [];

  mensaje: string = '';

  toastVisible: boolean = false;
  toastMensaje: string = '';
  toastTipo: 'success' | 'error' | 'warning' | 'info' = 'info';

  constructor(
    private abonoService: AbonoService,
    private prestamoService: PrestamoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarPendientes();
  }

  cargarPendientes(): void {
    this.abonoService.listarPendientes().subscribe({
      next: (data: Abono[]) => {
        this.abonosPendientes = data || [];
        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Error al cargar abonos pendientes', err);

        this.abonosPendientes = [];
        this.mostrarToast('No fue posible cargar los abonos pendientes.', 'error');

        this.cdr.detectChanges();
      }
    });
  }

  aprobarAbono(abonoId: number): void {
    this.prestamoService.aprobarAbono(abonoId).subscribe({
      next: () => {
        this.mensaje = 'Abono aprobado correctamente.';
        this.mostrarToast('Abono aprobado correctamente. El saldo del préstamo será actualizado.', 'success');

        this.cargarPendientes();
        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Error al aprobar abono', err);

        const mensaje = err?.error?.mensaje || 'No se pudo aprobar el abono.';
        this.mensaje = mensaje;
        this.mostrarToast(mensaje, 'error');

        this.cdr.detectChanges();
      }
    });
  }

  rechazarAbono(abonoId: number): void {
    this.prestamoService.rechazarAbono(abonoId).subscribe({
      next: () => {
        this.mensaje = 'Abono rechazado correctamente.';
        this.mostrarToast('Abono rechazado correctamente. El saldo del préstamo no cambió.', 'success');

        this.cargarPendientes();
        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Error al rechazar abono', err);

        const mensaje = err?.error?.mensaje || 'No se pudo rechazar el abono.';
        this.mensaje = mensaje;
        this.mostrarToast(mensaje, 'error');

        this.cdr.detectChanges();
      }
    });
  }

  obtenerNombreCliente(abono: any): string {
    return abono?.prestamo?.cliente?.nombre || 'Sin cliente';
  }

  obtenerInicialCliente(abono: any): string {
    const nombre = this.obtenerNombreCliente(abono);
    return nombre.charAt(0).toUpperCase();
  }

  obtenerCedulaCliente(abono: any): string {
    return abono?.prestamo?.cliente?.cedula || 'No registra';
  }

  obtenerIdPrestamo(abono: any): string {
    return abono?.prestamo?.id ? '#' + abono.prestamo.id : 'Sin préstamo';
  }

  obtenerEstado(abono: any): string {
    return abono?.estado || 'SIN ESTADO';
  }

  obtenerTotalPendiente(): number {
    return this.abonosPendientes.reduce(
      (sum: number, abono: Abono) => sum + Number(abono.monto || 0),
      0
    );
  }

  formatearDinero(valor: number): string {
    if (valor === null || valor === undefined || isNaN(Number(valor))) {
      return '$ 0';
    }

    return '$ ' + Number(valor).toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }

  mostrarToast(
    mensaje: string,
    tipo: 'success' | 'error' | 'warning' | 'info' = 'info'
  ): void {
    this.toastMensaje = mensaje;
    this.toastTipo = tipo;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
      this.cdr.detectChanges();
    }, 4200);
  }
}
