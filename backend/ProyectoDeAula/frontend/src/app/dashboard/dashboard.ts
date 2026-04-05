import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PrestamoService } from '../services/prestamo.service';
import { Prestamo } from '../services/prestamo';
import { GraficoComponent } from '../grafico/grafico';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, GraficoComponent],
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
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  formatearDinero(valor: number): string {
    return '$ ' + valor.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }

  cargarDatos(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const usuario = localStorage.getItem('usuarioLogueado');

    if (!usuario) {
      return;
    }

    const usuarioObj = JSON.parse(usuario);

    if (usuarioObj.rol === 'cliente' && usuarioObj.clienteId) {
      this.prestamoService.listarPorCliente(usuarioObj.clienteId).subscribe({
        next: (data: Prestamo[]) => {
          this.calcularResumen(data);
        },
        error: (err: any) => {
          console.error('Error cargando dashboard cliente', err);
        }
      });
    } else {
      this.prestamoService.listarPrestamos().subscribe({
        next: (data: Prestamo[]) => {
          this.calcularResumen(data);
        },
        error: (err: any) => {
          console.error('Error cargando dashboard general', err);
        }
      });
    }
  }

  calcularResumen(data: Prestamo[]): void {
    this.prestamos = data;

    this.totalPrestamos = data.length;

    this.totalPrestado = data.reduce((sum, p) => sum + p.monto, 0);

    this.saldoPendiente = data.reduce((sum, p) => sum + p.saldoPendiente, 0);

    this.totalAbonado = data.reduce((sum, p) => {
      const totalConInteres = p.monto + (p.monto * p.interes);
      return sum + (totalConInteres - p.saldoPendiente);
    }, 0);
  }
}
