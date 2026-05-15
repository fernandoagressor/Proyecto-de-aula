import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AbonoService } from '../services/abono.service';
import { PrestamoService } from '../services/prestamo.service';
import { Abono } from '../services/abono';

@Component({
  selector: 'app-historial-abonos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-abonos.html',
  styleUrls: ['./historial-abonos.css']
})
export class HistorialAbonosComponent implements OnInit {

  abonos: Abono[] = [];
  cargando: boolean = true;

  usuarioLogueado: any = null;

  constructor(
    private abonoService: AbonoService,
    private prestamoService: PrestamoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

    if (usuarioGuardado) {
      this.usuarioLogueado = JSON.parse(usuarioGuardado);
    }

    this.cargarAbonos();
  }

  cargarAbonos(): void {
    const rol = this.usuarioLogueado?.rol;

    if (rol === 'cliente') {
      this.cargarHistorialCliente();
      return;
    }

    if (rol === 'empleado_empresa') {
      this.cargarHistorialEmpleado();
      return;
    }

    this.cargarHistorialGeneral();
  }

  cargarHistorialCliente(): void {
    this.abonoService.listarAbonos().subscribe({
      next: (data: Abono[]) => {
        this.abonos = (data || []).filter(
          (abono: any) =>
            abono?.prestamo?.cliente?.id === this.usuarioLogueado?.clienteId

        );

        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al cargar historial cliente', err);
        this.cargando = false;
      }
    });
    this.cdr.detectChanges();
  }

  cargarHistorialEmpleado(): void {
    const empleadoId = this.usuarioLogueado?.empleadoId;

    if (!empleadoId) {
      this.abonos = [];
      this.cargando = false;
      return;
    }

    this.prestamoService.listarPorEmpleado(empleadoId).subscribe({
      next: (prestamos: any[]) => {
        const idsPrestamos = (prestamos || []).map(p => p.id);

        this.abonoService.listarAbonos().subscribe({
          next: (data: Abono[]) => {
            this.abonos = (data || []).filter(
              (abono: any) =>
                idsPrestamos.includes(abono?.prestamo?.id)
            );

            this.cargando = false;
          },
          error: (err: any) => {
            console.error('Error al cargar abonos empleado', err);
            this.cargando = false;
          }
        });
      },
      error: (err: any) => {
        console.error('Error al cargar préstamos empleado', err);
        this.cargando = false;
      }
    });
    this.cdr.detectChanges();
  }

  cargarHistorialGeneral(): void {
    this.abonoService.listarAbonos().subscribe({
      next: (data: Abono[]) => {
        this.abonos = data || [];
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al cargar historial general', err);
        this.cargando = false;
      }
    });
    this.cdr.detectChanges();
  }

  obtenerNombreTitular(abono: any): string {
    return (
      abono?.prestamo?.cliente?.nombre ||
      abono?.prestamo?.empleadoNombre ||
      'Sin titular'
    );
  }

  obtenerDocumentoTitular(abono: any): string {
    return (
      abono?.prestamo?.cliente?.cedula ||
      abono?.prestamo?.empleadoCedula ||
      'No registra'
    );
  }

  obtenerTipoTitular(abono: any): string {
    if (abono?.prestamo?.cliente) {
      return 'Cliente';
    }

    if (abono?.prestamo?.empleadoNombre) {
      return 'Empleado empresa';
    }

    return 'Sin tipo';
  }

  obtenerIdPrestamo(abono: any): string {
    return abono?.prestamo?.id ? '#' + abono.prestamo.id : 'Sin préstamo';
  }

  obtenerMetodoPago(abono: any): string {
    return abono?.metodoPago || 'MANUAL';
  }

  obtenerReferenciaPago(abono: any): string {
    return abono?.referenciaPago || 'Sin referencia';
  }

  descargarComprobante(abonoId: number | undefined): void {
    if (!abonoId) {
      return;
    }

    this.prestamoService.abrirComprobanteAbono(abonoId);
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
}
