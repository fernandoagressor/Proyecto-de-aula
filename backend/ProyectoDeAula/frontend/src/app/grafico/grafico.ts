// Importa decoradores y ciclos de vida
// OnInit → se ejecuta al iniciar
// AfterViewInit → se ejecuta cuando el HTML ya está listo
import { Component, OnInit, AfterViewInit } from '@angular/core';

// Permite usar directivas Angular (*ngIf, *ngFor)
import { CommonModule } from '@angular/common';

// Librería Chart.js para crear gráficos
import { Chart } from 'chart.js/auto';

// Servicios para obtener datos del backend
import { PrestamoService } from '../services/prestamo.service';
import { AbonoService } from '../services/abono.service';


// Decorador del componente
@Component({
  selector: 'app-grafico', // Nombre en HTML

  standalone: true,

  imports: [CommonModule],

  templateUrl: './grafico.html',

  styleUrls: ['./grafico.css']
})

// Clase del componente
export class GraficoComponent implements OnInit, AfterViewInit {

  // Lista de préstamos
  prestamos: any[] = [];

  // Lista de abonos
  abonos: any[] = [];

  // Constructor con servicios
  constructor(
    private prestamoService: PrestamoService,
    private abonoService: AbonoService
  ) {}

  // Se ejecuta al iniciar
  ngOnInit(): void {
    this.cargarDatos();
  }

  // Se ejecuta cuando el HTML ya está renderizado
  ngAfterViewInit(): void {
    // Aquí podrías dibujar gráficos si ya hubiera datos
  }

  // Método para cargar datos del backend
  cargarDatos(): void {

    // Llama al backend (GET préstamos)
    this.prestamoService.listarPrestamos().subscribe({

      // Cuando llegan los préstamos
      next: (prestamos) => {

        // Guarda los datos
        this.prestamos = prestamos;

        // Luego carga abonos
        this.abonoService.listarAbonos().subscribe({

          // Cuando llegan los abonos
          next: (abonos) => {

            // Guarda los abonos
            this.abonos = abonos;

            // Crea los gráficos
            this.crearGraficos();
          },

          // Si falla abonos
          error: (err) => {
            console.error('Error cargando abonos', err);

            // Aun así intenta crear gráficos
            this.crearGraficos();
          }
        });
      },

      // Error en préstamos
      error: (err) => {
        console.error('Error cargando préstamos', err);
      }
    });
  }

  // Método general para crear todos los gráficos
  crearGraficos(): void {
    this.crearGraficoEstados();
    this.crearGraficoMensual();
  }

  // Gráfico 1: Monto por estado
  crearGraficoEstados(): void {

    // Obtiene el canvas del HTML
    const canvas = document.getElementById('graficoEstados') as HTMLCanvasElement;

    // Si no existe, no hace nada
    if (!canvas) return;

    // Si ya existe un gráfico, lo elimina (evita duplicados)
    const existente = Chart.getChart(canvas);
    if (existente) {
      existente.destroy();
    }

    // Calcula total por estado
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

    // Crea el gráfico de barras
    new Chart(canvas, {
      type: 'bar', // Tipo barra

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

  // Gráfico 2: Abonos por mes
  crearGraficoMensual(): void {

    // Obtiene canvas
    const canvas = document.getElementById('graficoMensual') as HTMLCanvasElement;

    if (!canvas) return;

    // Elimina gráfico anterior
    const existente = Chart.getChart(canvas);
    if (existente) {
      existente.destroy();
    }

    // Nombres de meses
    const meses = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];

    // Arreglo para totales por mes
    const totales = new Array(12).fill(0);

    // Recorre abonos
    this.abonos.forEach(abono => {

      // Convierte fecha
      const fecha = new Date(abono.fecha);

      // Obtiene mes (0-11)
      const mes = fecha.getMonth();

      // Suma el monto
      totales[mes] += abono.monto;
    });

    // Crea gráfico de línea
    new Chart(canvas, {
      type: 'line',

      data: {
        labels: meses,
        datasets: [
          {
            label: 'Abonos por mes',
            data: totales,
            tension: 0.3, // curva
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
