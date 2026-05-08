import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
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
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const usuario = localStorage.getItem('usuarioLogueado');

    if (!usuario) {
      this.calcularResumen([]);
      this.cdr.detectChanges();
      return;
    }

    const usuarioObj = JSON.parse(usuario);

    if (usuarioObj.rol === 'cliente' && usuarioObj.clienteId) {
      this.prestamoService.listarPorCliente(usuarioObj.clienteId).subscribe({
        next: (data: Prestamo[]) => {
          this.calcularResumen(data || []);
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error cargando dashboard cliente', err);
          this.calcularResumen([]);
          this.cdr.detectChanges();
        }
      });

      return;
    }

    this.prestamoService.listarPrestamos().subscribe({
      next: (data: Prestamo[]) => {
        this.calcularResumen(data || []);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error cargando dashboard general', err);
        this.calcularResumen([]);
        this.cdr.detectChanges();
      }
    });
  }

  calcularResumen(data: Prestamo[]): void {
    this.prestamos = data || [];

    this.totalPrestamos = this.prestamos.length;

    this.totalPrestado = this.prestamos.reduce(
      (sum, p) => sum + Number(p.monto || 0),
      0
    );

    this.saldoPendiente = this.prestamos.reduce(
      (sum, p) => sum + Number(p.saldoPendiente || 0),
      0
    );

    this.totalAbonado = this.prestamos.reduce((sum, p) => {
      const monto = Number(p.monto || 0);
      const interes = Number(p.interes || 0);
      const saldo = Number(p.saldoPendiente || 0);

      const totalConInteresCalculado = monto + (monto * interes);
      const abonado = totalConInteresCalculado - saldo;

      return sum + Math.max(abonado, 0);
    }, 0);
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
