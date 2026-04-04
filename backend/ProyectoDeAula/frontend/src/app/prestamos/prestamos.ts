import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrestamoService } from '../services/prestamo.service';
import { Prestamo } from '../services/prestamo';
import {Abono} from '../services/abono';
import {AbonoService} from '../services/abono.service';

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prestamos.html',
  styleUrl: './prestamos.css'
})
export class PrestamosComponent implements OnInit {

  prestamos: Prestamo[] = [];
  historialAbonos: Abono[] = [];
  prestamoSeleccionadoHistorial: number| null = null;
  nuevoPrestamo = {
    clienteId: '',
    monto: '',
    plazoMeses: '',
    interes: ''
  };

  abonos: { [key: number]: string } = {};

  usuarioLogueado: any = null;

  constructor(private prestamoService: PrestamoService, private abonoService: AbonoService) { }

  verHistorial(prestamoId: number): void {
    this.prestamoSeleccionadoHistorial = prestamoId;

    this.abonoService.listarAbonosPorPrestamo(prestamoId).subscribe({
      next: (data: Abono[]) => {
        this.historialAbonos = data;
      },
      error: (err: any) => {
        console.error('Error al cargar historial de abonos', err);
      }
    });
  }

  ngOnInit(): void {
    this.cargarPrestamos();

    if (typeof window !== 'undefined') {
      const usuarioGuardado = localStorage.getItem('usuarioLogueado');
      if (usuarioGuardado) {
        this.usuarioLogueado = JSON.parse(usuarioGuardado);
      }
    }
  }

  cargarPrestamos(): void {
    this.prestamoService.listarPrestamos().subscribe({
      next: (data: Prestamo[]) => {
        this.prestamos = data;
      },
      error: (err: any) => {
        console.error('Error al cargar préstamos', err);
      }
    });
  }

  crearPrestamo(): void {
    this.prestamoService.solicitarPrestamo(this.nuevoPrestamo).subscribe({
      next: () => {
        this.cargarPrestamos();
        this.nuevoPrestamo = {
          clienteId: '',
          monto: '',
          plazoMeses: '',
          interes: ''
        };
      },
      error: (err: any) => {
        console.error('Error al crear préstamo', err);
      }
    });
  }

  aprobarPrestamo(id: number): void {
    this.prestamoService.aprobarPrestamo(id).subscribe({
      next: () => {
        this.cargarPrestamos();
      },
      error: (err: any) => {
        console.error('Error al aprobar préstamo', err);
      }
    });
  }

  rechazarPrestamo(id: number): void {
    this.prestamoService.rechazarPrestamo(id).subscribe({
      next: () => {
        this.cargarPrestamos();
      },
      error: (err: any) => {
        console.error('Error al rechazar préstamo', err);
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
        this.cargarPrestamos();
        this.abonos[id] = '';
      },
      error: (err: any) => {
        console.error('Error al abonar préstamo', err);
      }
    });
  }

  esAdmin(): boolean {
    return this.usuarioLogueado !== null && this.usuarioLogueado.rol === 'administrador';
  }

  esEmpleado(): boolean {
    return this.usuarioLogueado !== null && this.usuarioLogueado.rol === 'empleado';
  }
}
