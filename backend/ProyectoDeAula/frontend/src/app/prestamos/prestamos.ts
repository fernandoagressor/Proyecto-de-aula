import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PrestamoService } from '../services/prestamo.service';
import { Prestamo } from '../services/prestamo';

import { Abono } from '../services/abono';
import { AbonoService } from '../services/abono.service';

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prestamos.html',
  styleUrls: ['./prestamos.css']
})
export class PrestamosComponent implements OnInit {

  prestamos: Prestamo[] = [];
  historialAbonos: Abono[] = [];

  prestamoSeleccionadoHistorial: number | null = null;

  nuevoPrestamo = {
    clienteId: '',
    monto: '',
    plazoMeses: '',
    interes: ''
  };

  abonos: { [key: number]: string } = {};

  usuarioLogueado: any = null;

  filtroEstado: string = 'TODOS';

  toastVisible: boolean = false;
  toastMensaje: string = '';
  toastTipo: 'success' | 'error' | 'warning' | 'info' = 'info';

  constructor(
    private prestamoService: PrestamoService,
    private abonoService: AbonoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarUsuarioLogueado();
    this.cargarPrestamos();
  }

  cargarUsuarioLogueado(): void {
    if (typeof window !== 'undefined') {
      const usuarioGuardado = localStorage.getItem('usuarioLogueado');

      if (usuarioGuardado) {
        this.usuarioLogueado = JSON.parse(usuarioGuardado);
      }
    }

    this.cdr.detectChanges();
  }

  cargarPrestamos(): void {

    const rol = (
      this.usuarioLogueado?.rol ||
      this.usuarioLogueado?.tipoUsuario ||
      ''
    ).toUpperCase();

    // EMPRESA → solo préstamos de su empresa
    if (rol === 'EMPRESA') {

      const empresaId = this.usuarioLogueado?.empresaId;

      if (!empresaId) {
        this.prestamos = [];
        return;
      }

      this.prestamoService.listarPorEmpresa(empresaId).subscribe({

        next: (data: Prestamo[]) => {

          this.prestamos = data || [];
          this.cdr.detectChanges();
        },

        error: (err: any) => {

          console.error(
            'Error al cargar préstamos de empresa',
            err
          );

          this.prestamos = [];

          this.mostrarToast(
            'No fue posible cargar los préstamos.',
            'error'
          );

          this.cdr.detectChanges();
        }
      });

      return;
    }


    // ADMIN → solo préstamos de clientes
    this.prestamoService.listarPrestamosClientes().subscribe({

      next: (data: Prestamo[]) => {

        this.prestamos = data || [];
        this.cdr.detectChanges();
      },

      error: (err: any) => {

        console.error('Error al cargar préstamos', err);

        this.prestamos = [];

        this.mostrarToast(
          'No fue posible cargar los préstamos.',
          'error'
        );

        this.cdr.detectChanges();
      }
    });
  }

  crearPrestamo(): void {
    if (
      !this.nuevoPrestamo.clienteId ||
      !this.nuevoPrestamo.monto ||
      !this.nuevoPrestamo.plazoMeses
    ) {
      this.mostrarToast('Debe ingresar el ID del cliente, el monto y el plazo.', 'warning');
      return;
    }

    const monto = Number(this.nuevoPrestamo.monto);
    const plazo = Number(this.nuevoPrestamo.plazoMeses);

    if (isNaN(monto) || monto <= 0) {
      this.mostrarToast('El monto debe ser un número mayor a cero.', 'warning');
      return;
    }

    if (isNaN(plazo) || plazo <= 0) {
      this.mostrarToast('El plazo debe ser un número mayor a cero.', 'warning');
      return;
    }

    this.prestamoService.solicitarPrestamo(this.nuevoPrestamo).subscribe({
      next: () => {
        this.nuevoPrestamo = {
          clienteId: '',
          monto: '',
          plazoMeses: '',
          interes: ''
        };

        this.mostrarToast('Solicitud de préstamo creada correctamente.', 'success');
        this.cargarPrestamos();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al crear préstamo', err);

        const mensaje = err?.error?.mensaje || 'No fue posible crear la solicitud de préstamo.';
        this.mostrarToast(mensaje, 'error');

        this.cdr.detectChanges();
      }
    });
  }

  aprobarPrestamo(id: number): void {
    this.prestamoService.aprobarPrestamo(id).subscribe({
      next: () => {
        this.mostrarToast('Préstamo aprobado correctamente.', 'success');
        this.cargarPrestamos();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al aprobar préstamo', err);

        const mensaje = err?.error?.mensaje || 'No fue posible aprobar el préstamo.';
        this.mostrarToast(mensaje, 'error');

        this.cdr.detectChanges();
      }
    });
  }

  rechazarPrestamo(id: number): void {
    this.prestamoService.rechazarPrestamo(id).subscribe({
      next: () => {
        this.mostrarToast('Préstamo rechazado correctamente.', 'success');
        this.cargarPrestamos();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al rechazar préstamo', err);

        const mensaje = err?.error?.mensaje || 'No fue posible rechazar el préstamo.';
        this.mostrarToast(mensaje, 'error');

        this.cdr.detectChanges();
      }
    });
  }

  pagarTotal(prestamo: Prestamo): void {
    if (prestamo.estado !== 'APROBADO') {
      this.mostrarToast('Solo se pueden pagar préstamos aprobados.', 'warning');
      return;
    }

    const saldoTotal = this.obtenerValorNumero(prestamo.saldoPendiente);

    if (saldoTotal <= 0) {
      this.mostrarToast('Este préstamo no tiene saldo pendiente.', 'warning');
      return;
    }

    this.prestamoService.abonarPrestamo(prestamo.id!, String(saldoTotal)).subscribe({
      next: () => {
        this.abonos[prestamo.id!] = '';

        this.mostrarToast('Pago total enviado para revisión.', 'success');
        this.cargarPrestamos();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al pagar total del préstamo', err);

        const mensaje = err?.error?.mensaje || 'No fue posible registrar el pago total.';
        this.mostrarToast(mensaje, 'error');

        this.cdr.detectChanges();
      }
    });
  }

  abonarPrestamo(id: number): void {
    const abono = Number(this.abonos[id]);

    if (!abono || abono <= 0 || isNaN(abono)) {
      this.mostrarToast('El abono debe ser un número mayor a cero.', 'warning');
      return;
    }

    this.prestamoService.abonarPrestamo(id, abono.toString()).subscribe({
      next: () => {
        this.abonos[id] = '';

        this.mostrarToast('Abono enviado correctamente. Queda pendiente de aprobación.', 'success');
        this.cargarPrestamos();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al abonar préstamo', err);

        const mensaje = err?.error?.mensaje || 'No fue posible registrar el abono.';
        this.mostrarToast(mensaje, 'error');

        this.cdr.detectChanges();
      }
    });
  }

  verHistorial(prestamoId: number): void {
    this.prestamoSeleccionadoHistorial = prestamoId;

    this.abonoService.listarAbonosPorPrestamo(prestamoId).subscribe({
      next: (data: Abono[]) => {
        this.historialAbonos = data || [];

        this.mostrarToast('Historial de abonos cargado.', 'info');
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar historial de abonos', err);

        this.historialAbonos = [];
        this.mostrarToast('No fue posible cargar el historial de abonos.', 'error');

        this.cdr.detectChanges();
      }
    });
  }

  cerrarHistorial(): void {
    this.prestamoSeleccionadoHistorial = null;
    this.historialAbonos = [];
  }

  cambiarFiltro(estado: string): void {
    this.filtroEstado = estado;
  }

  obtenerPrestamosFiltrados(): Prestamo[] {
    if (this.filtroEstado === 'TODOS') {
      return this.prestamos;
    }

    return this.prestamos.filter((p: Prestamo) => p.estado === this.filtroEstado);
  }

  contarPorEstado(estado: string): number {
    return this.prestamos.filter((p: Prestamo) => p.estado === estado).length;
  }

  calcularTotalPrestado(): number {
    return this.prestamos.reduce(
      (sum: number, p: Prestamo) => sum + this.obtenerValorNumero(p.monto),
      0
    );
  }

  calcularSaldoPendiente(): number {
    return this.prestamos.reduce(
      (sum: number, p: Prestamo) => sum + this.obtenerValorNumero(p.saldoPendiente),
      0
    );
  }

  calcularProgreso(prestamo: any): number {
    const monto = this.obtenerValorNumero(prestamo?.monto);
    const interes = this.obtenerValorNumero(prestamo?.interes);
    const saldoPendiente = this.obtenerValorNumero(prestamo?.saldoPendiente);

    const total = monto + (monto * interes);

    if (total <= 0) {
      return 0;
    }

    const pagado = total - saldoPendiente;
    const porcentaje = (pagado / total) * 100;

    if (porcentaje < 0) {
      return 0;
    }

    if (porcentaje > 100) {
      return 100;
    }

    return porcentaje;
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

  obtenerNombreCliente(prestamo: any): string {
    return prestamo?.cliente?.nombre || 'Cliente no asignado';
  }

  obtenerInicialCliente(prestamo: any): string {
    const nombre = this.obtenerNombreCliente(prestamo);
    return nombre.charAt(0).toUpperCase();
  }

  obtenerValorNumero(valor: any): number {
    return Number(valor || 0);
  }

  obtenerEstado(estado: any): string {
    return estado || 'SIN ESTADO';
  }

  obtenerInteresPorcentaje(prestamo: any): string {
    const interes = this.obtenerValorNumero(prestamo?.interes);

    if (interes <= 1) {
      return (interes * 100).toFixed(2) + '%';
    }

    return interes.toFixed(2) + '%';
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

  esAdmin(): boolean {

    const rol = (
      this.usuarioLogueado?.rol ||
      this.usuarioLogueado?.tipoUsuario ||
      ''
    ).toUpperCase();

    return rol === 'ADMIN' || rol === 'ADMINISTRADOR';
  }

  esEmpleado(): boolean {

    const rol = (
      this.usuarioLogueado?.rol ||
      this.usuarioLogueado?.tipoUsuario ||
      ''
    ).toUpperCase();

    return rol === 'EMPLEADO';
  }
  esEmpresa(): boolean {

    const rol = (
      this.usuarioLogueado?.rol ||
      this.usuarioLogueado?.tipoUsuario ||
      ''
    ).toUpperCase();

    return rol === 'EMPRESA';
  }

  esCliente(): boolean {
    return this.usuarioLogueado !== null && this.usuarioLogueado.rol === 'cliente';
  }
}
