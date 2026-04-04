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
  clientePrueba: number = 0;

  abonos: { [key: number]: string } = {};
  historialAbonos: Abono[] = [];
  prestamoSeleccionadoHistorial: number | null = null;

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
  cargarPrueba(): void {
    if (!this.clientePrueba) return;

    console.log('Probando clienteId:', this.clientePrueba);

    this.prestamoService.listarPorCliente(this.clientePrueba).subscribe({
      next: (data) => {
        console.log('DATA PRUEBA:', data);
        this.prestamos = data;
      },
      error: (err) => {
        console.error('Error prueba:', err);
      }
    });
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
    const abono = this.abonos[id];

    if (!abono || abono.trim() === '') {
      return;
    }

    this.prestamoService.abonarPrestamo(id, abono).subscribe({
      next: () => {
        this.cargarMisPrestamos(this.usuarioLogueado.clienteId);
        this.abonos[id] = '';
      },
      error: (err: any) => {
        console.error('Error al abonar préstamo', err);
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
        console.error('Error al cargar historial', err);
      }
    });
  }

  puedeAbonar(estado: string): boolean {
    return estado === 'APROBADO';
  }

  calcularCuotasRestantes(prestamo: Prestamo): number {
    if (!prestamo.cuotaMensual || prestamo.cuotaMensual <= 0) {
      return 0;
    }

    return Math.ceil(prestamo.saldoPendiente / prestamo.cuotaMensual);
  }
}
