import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrestamoService } from '../services/prestamo.service';
import { Prestamo } from '../services/prestamo';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  prestamos: Prestamo[] = [];

  totalPrestamos: number = 0;
  totalPrestado: number = 0;
  saldoPendiente: number = 0;
  totalAbonado: number = 0;

  constructor(
    private prestamoService: PrestamoService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    const usuario = localStorage.getItem('usuarioLogueado');

    if (!usuario) return;

    const usuarioObj = JSON.parse(usuario);

    if (usuarioObj.rol === 'cliente' && usuarioObj.clienteId) {
      this.prestamoService.listarPorCliente(usuarioObj.clienteId)
        .subscribe({
          next: (data: Prestamo[]) => {
            this.prestamos = data;

            this.totalPrestamos = data.length;
            this.totalPrestado = data.reduce((sum, p) => sum + p.monto, 0);
            this.saldoPendiente = data.reduce((sum, p) => sum + p.saldoPendiente, 0);

            this.totalAbonado = data.reduce((sum, p) => {
              const total = p.monto + (p.monto * p.interes);
              return sum + (total - p.saldoPendiente);
            }, 0);

            this.cd.detectChanges();
          },
          error: (err: any) => {
            console.error('Error cargando dashboard cliente', err);
          }
        });
    } else {
      this.prestamoService.listarPrestamos()
        .subscribe({
          next: (data: Prestamo[]) => {
            this.prestamos = data;

            this.totalPrestamos = data.length;
            this.totalPrestado = data.reduce((sum, p) => sum + p.monto, 0);
            this.saldoPendiente = data.reduce((sum, p) => sum + p.saldoPendiente, 0);

            this.totalAbonado = data.reduce((sum, p) => {
              const total = p.monto + (p.monto * p.interes);
              return sum + (total - p.saldoPendiente);
            }, 0);

            this.cd.detectChanges();
          },
          error: (err: any) => {
            console.error('Error cargando dashboard general', err);
          }
        });
    }
  }
}
