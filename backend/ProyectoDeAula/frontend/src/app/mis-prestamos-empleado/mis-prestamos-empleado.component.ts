import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PrestamoService } from '../services/prestamo.service';
import { Prestamo } from '../services/prestamo';

import { AbonoService } from '../services/abono.service';
import { Abono } from '../services/abono';

@Component({
  selector: 'app-mis-prestamos-empleado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-prestamos-empleado.component.html',
  styleUrls: ['./mis-prestamos-empleado.component.css']
})
export class MisPrestamosEmpleadoComponent implements OnInit {

  prestamos: Prestamo[] = [];
  usuarioLogueado: any = null;

  abonos: { [key: number]: string } = {};

  historialAbonos: Abono[] = [];
  prestamoSeleccionadoHistorial: number | null = null;

  mensaje: string = '';

  pseModalVisible: boolean = false;
  pseProcesando: boolean = false;
  pseFinalizado: boolean = false;
  psePaso: number = 0;

  prestamoSeleccionadoPse: Prestamo | null = null;
  montoSeleccionadoPse: number = 0;

  respuestaPse: any = null;

  toastVisible: boolean = false;
  toastMensaje: string = '';
  toastTipo: 'success' | 'error' | 'warning' | 'info' = 'info';

  constructor(
    private prestamoService: PrestamoService,
    private abonoService: AbonoService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

    if (usuarioGuardado) {
      this.usuarioLogueado = JSON.parse(usuarioGuardado);
      this.cargarMisPrestamosEmpleado();
    }
  }

  cargarMisPrestamosEmpleado(): void {
    const empleadoId =
      this.usuarioLogueado?.empleadoId ||
      this.usuarioLogueado?.idEmpleado ||
      this.usuarioLogueado?.empleado?.id ||
      this.usuarioLogueado?.id;

    if (!empleadoId) {
      this.prestamos = [];
      this.mostrarToast('No se encontró el empleado logueado.', 'warning');
      this.cd.detectChanges();
      return;
    }

    this.prestamoService.listarPorEmpleado(empleadoId).subscribe({
      next: (data: Prestamo[]) => {
        this.prestamos = data || [];
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar préstamos empleado', err);
        this.prestamos = [];
        this.mostrarToast('No fue posible cargar tus préstamos.', 'error');
        this.cd.detectChanges();
      }
    });
  }

  iniciarPagoPse(prestamo: Prestamo): void {
    if (!this.puedeAbonar(prestamo.estado)) {
      this.mostrarToast('Solo puedes pagar préstamos aprobados.', 'warning');
      return;
    }

    const valorAbono = this.abonos[prestamo.id!];

    if (!valorAbono || valorAbono.trim() === '') {
      this.mostrarToast('Debes escribir un valor para pagar por PSE.', 'warning');
      return;
    }

    const monto = Number(valorAbono);

    if (isNaN(monto) || monto <= 0) {
      this.mostrarToast('El valor del pago debe ser mayor a cero.', 'warning');
      return;
    }

    if (monto > prestamo.saldoPendiente) {
      this.mostrarToast('El pago no puede ser mayor al saldo pendiente.', 'warning');
      return;
    }

    this.prestamoSeleccionadoPse = prestamo;
    this.montoSeleccionadoPse = monto;
    this.respuestaPse = null;

    this.pseModalVisible = true;
    this.pseProcesando = true;
    this.pseFinalizado = false;
    this.psePaso = 1;

    this.simularFlujoPse();
  }

  pagarTotalPse(prestamo: Prestamo): void {
    if (!this.puedeAbonar(prestamo.estado)) {
      this.mostrarToast('Solo puedes pagar préstamos aprobados.', 'warning');
      return;
    }

    const saldoTotal = Number(prestamo.saldoPendiente || 0);

    if (saldoTotal <= 0) {
      this.mostrarToast('Este préstamo no tiene saldo pendiente.', 'warning');
      return;
    }

    this.abonos[prestamo.id!] = String(saldoTotal);
    this.iniciarPagoPse(prestamo);
  }

  simularFlujoPse(): void {
    setTimeout(() => {
      this.psePaso = 2;
      this.cd.detectChanges();
    }, 900);

    setTimeout(() => {
      this.psePaso = 3;
      this.cd.detectChanges();
    }, 1800);

    setTimeout(() => {
      this.confirmarPagoPse();
    }, 2800);
  }

  confirmarPagoPse(): void {
    if (!this.prestamoSeleccionadoPse || !this.prestamoSeleccionadoPse.id) {
      this.mostrarToast('No se encontró el préstamo seleccionado.', 'error');
      this.cerrarModalPse();
      return;
    }

    this.prestamoService.pagarPorPse(
      this.prestamoSeleccionadoPse.id,
      this.montoSeleccionadoPse
    ).subscribe({
      next: (respuesta: any) => {
        this.respuestaPse = respuesta;

        this.pseProcesando = false;
        this.pseFinalizado = true;
        this.psePaso = 4;

        this.mensaje = respuesta?.mensaje || 'Pago PSE aprobado correctamente.';
        this.mostrarToast('Pago PSE aprobado correctamente.', 'success');

        this.abonos[this.prestamoSeleccionadoPse!.id!] = '';

        this.cargarMisPrestamosEmpleado();

        if (this.prestamoSeleccionadoHistorial !== null) {
          this.verHistorial(this.prestamoSeleccionadoHistorial);
        }

        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al pagar por PSE', err);

        this.pseProcesando = false;
        this.pseFinalizado = false;

        const mensaje = err?.error?.mensaje || 'No se pudo procesar el pago PSE.';
        this.mostrarToast(mensaje, 'error');
        this.mensaje = mensaje;

        this.cd.detectChanges();
      }
    });
  }

  cerrarModalPse(): void {
    this.pseModalVisible = false;
    this.pseProcesando = false;
    this.pseFinalizado = false;
    this.psePaso = 0;
    this.prestamoSeleccionadoPse = null;
    this.montoSeleccionadoPse = 0;
    this.respuestaPse = null;
  }

  verHistorial(prestamoId: number): void {
    this.prestamoSeleccionadoHistorial = prestamoId;

    this.abonoService.listarAbonosPorPrestamo(prestamoId).subscribe({
      next: (data: Abono[]) => {
        this.historialAbonos = data || [];
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar historial de abonos', err);
        this.historialAbonos = [];
        this.mostrarToast('No fue posible cargar el historial.', 'error');
        this.cd.detectChanges();
      }
    });
  }

  cerrarHistorial(): void {
    this.prestamoSeleccionadoHistorial = null;
    this.historialAbonos = [];
  }

  descargarComprobante(abonoId: number | undefined): void {
    if (!abonoId) {
      this.mostrarToast('No se encontró el comprobante del abono.', 'warning');
      return;
    }

    this.prestamoService.descargarComprobanteAbono(abonoId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const enlace = document.createElement('a');

        enlace.href = url;
        enlace.download = `comprobante-abono-${abonoId}.pdf`;
        enlace.click();

        window.URL.revokeObjectURL(url);

        this.mostrarToast('Comprobante descargado correctamente.', 'success');
      },
      error: (err: any) => {
        console.error('Error descargando comprobante', err);
        this.mostrarToast('No fue posible descargar el comprobante.', 'error');
      }
    });
  }

  abrirComprobanteDesdeModal(): void {
    if (!this.respuestaPse?.abonoId) {
      this.mostrarToast('No se encontró el comprobante del pago.', 'warning');
      return;
    }

    this.descargarComprobante(this.respuestaPse.abonoId);
  }

  puedeAbonar(estado: string): boolean {
    return estado === 'APROBADO';
  }

  calcularProgreso(prestamo: Prestamo): number {
    const monto = Number(prestamo.monto || 0);
    const interes = Number(prestamo.interes || 0);
    const saldoPendiente = Number(prestamo.saldoPendiente || 0);

    const total = monto + (monto * interes);

    if (total <= 0) {
      return 0;
    }

    const pagado = total - saldoPendiente;
    return Math.max(0, Math.min(100, (pagado / total) * 100));
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

  obtenerTotalSaldoPendiente(): number {
    return this.prestamos.reduce(
      (sum: number, prestamo: Prestamo) => sum + Number(prestamo.saldoPendiente || 0),
      0
    );
  }

  obtenerPrestamosActivos(): number {
    return this.prestamos.filter((p: Prestamo) => p.estado === 'APROBADO').length;
  }

  obtenerEstadoAbono(abono: any): string {
    return abono?.estado || 'SIN ESTADO';
  }

  obtenerMetodoPago(abono: any): string {
    return abono?.metodoPago || 'MANUAL';
  }

  obtenerReferenciaPago(abono: any): string {
    return abono?.referenciaPago || 'Sin referencia';
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
      this.cd.detectChanges();
    }, 4200);
  }
}
