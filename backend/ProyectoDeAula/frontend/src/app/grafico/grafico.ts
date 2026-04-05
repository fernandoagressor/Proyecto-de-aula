import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { PrestamoService } from '../services/prestamo.service';
import { AbonoService } from '../services/abono.service';

@Component({
  selector: 'app-grafico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grafico.html',
  styleUrls: ['./grafico.css']
})
export class GraficoComponent implements OnInit, AfterViewInit {

  prestamos: any[] = [];
  abonos: any[] = [];

  constructor(
    private prestamoService: PrestamoService,
    private abonoService: AbonoService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngAfterViewInit(): void {
    // se dibuja cuando ya existan datos
  }

  cargarDatos(): void {
    this.prestamoService.listarPrestamos().subscribe({
      next: (prestamos) => {
        this.prestamos = prestamos;

        this.abonoService.listarAbonos().subscribe({
          next: (abonos) => {
            this.abonos = abonos;
            this.crearGraficos();
          },
          error: (err) => {
            console.error('Error cargando abonos', err);
            this.crearGraficos();
          }
        });
      },
      error: (err) => {
        console.error('Error cargando préstamos', err);
      }
    });
  }

  crearGraficos(): void {
    this.crearGraficoEstados();
    this.crearGraficoMensual();
  }

  crearGraficoEstados(): void {
    const canvas = document.getElementById('graficoEstados') as HTMLCanvasElement;
    if (!canvas) return;

    const existente = Chart.getChart(canvas);
    if (existente) {
      existente.destroy();
    }

    const aprobados = this.prestamos
      .filter(p => p.estado === 'APROBADO')
      .reduce((sum, p) => sum + p.monto, 0);

    const pendientes = this.prestamos
      .filter(p => p.estado === 'PENDIENTE')
      .reduce((sum, p) => sum + p.monto, 0);

    const pagados = this.prestamos
      .filter(p => p.estado === 'PAGADO')
      .reduce((sum, p) => sum + p.monto, 0);

    const rechazados = this.prestamos
      .filter(p => p.estado === 'RECHAZADO')
      .reduce((sum, p) => sum + p.monto, 0);

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Aprobados', 'Pendientes', 'Pagados', 'Rechazados'],
        datasets: [
          {
            label: 'Monto por estado',
            data: [aprobados, pendientes, pagados, rechazados],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  crearGraficoMensual(): void {
    const canvas = document.getElementById('graficoMensual') as HTMLCanvasElement;
    if (!canvas) return;

    const existente = Chart.getChart(canvas);
    if (existente) {
      existente.destroy();
    }

    const meses = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];

    const totales = new Array(12).fill(0);

    this.abonos.forEach(abono => {
      const fecha = new Date(abono.fecha);
      const mes = fecha.getMonth();
      totales[mes] += abono.monto;
    });

    new Chart(canvas, {
      type: 'line',
      data: {
        labels: meses,
        datasets: [
          {
            label: 'Abonos por mes',
            data: totales,
            tension: 0.3,
            fill: false,
            borderWidth: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}
