import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrestamoService } from '../services/prestamo.service';
import { AbonoService } from '../services/abono.service';
import { Prestamo } from '../services/prestamo';
import { Abono } from '../services/abono';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  totalPrestamos: number = 0;
  totalMontoPrestado: number = 0;
  totalSaldoPendiente: number = 0;
  totalAbonado: number = 0;

  constructor(
    private prestamoService: PrestamoService,
    private abonoService: AbonoService
  ) {}

  ngOnInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard(): void {
    this.prestamoService.listarPrestamos().subscribe({
      next: (prestamos: Prestamo[]) => {
        this.totalPrestamos = prestamos.length;
        this.totalMontoPrestado = prestamos.reduce((sum, p) => sum + p.monto, 0);
        this.totalSaldoPendiente = prestamos.reduce((sum, p) => sum + p.saldoPendiente, 0);
      },
      error: (err: any) => {
        console.error('Error al cargar préstamos del dashboard', err);
      }
    });

    this.abonoService.listarAbonos().subscribe({
      next: (abonos: Abono[]) => {
        this.totalAbonado = abonos.reduce((sum, a) => sum + a.monto, 0);
      },
      error: (err: any) => {
        console.error('Error al cargar abonos del dashboard', err);
      }
    });
  }
}
