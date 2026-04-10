import { Component, OnInit } from '@angular/core';
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

  constructor(
    private abonoService: AbonoService,
    private prestamoService: PrestamoService
  ) {}

  ngOnInit(): void {
    this.cargarPendientes();
  }

  cargarPendientes(): void {
    this.abonoService.listarPendientes().subscribe({
      next: (data: Abono[]) => {
        this.abonosPendientes = data;
      },
      error: (err: any) => {
        console.error('Error al cargar abonos pendientes', err);
      }
    });
  }

  aprobarAbono(abonoId: number): void {
    this.prestamoService.aprobarAbono(abonoId).subscribe({
      next: () => {
        this.mensaje = 'Abono aprobado correctamente';
        this.cargarPendientes();
      },
      error: (err: any) => {
        console.error('Error al aprobar abono', err);
      }
    });
  }

  rechazarAbono(abonoId: number): void {
    this.prestamoService.rechazarAbono(abonoId).subscribe({
      next: () => {
        this.mensaje = 'Abono rechazado correctamente';
        this.cargarPendientes();
      },
      error: (err: any) => {
        console.error('Error al rechazar abono', err);
      }
    });
  }

  formatearDinero(valor: number): string {
    return '$ ' + valor.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }
}
