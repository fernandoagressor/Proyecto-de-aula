// Importa Component y OnInit desde Angular
import { Component, OnInit } from '@angular/core';

// Importa CommonModule para usar directivas como *ngIf y *ngFor
import { CommonModule } from '@angular/common';

// Importa FormsModule para usar [(ngModel)] en los formularios
import { FormsModule } from '@angular/forms';

// Importa el servicio de préstamos para comunicarse con el backend
import { PrestamoService } from '../services/prestamo.service';

// Importa el modelo Prestamo
import { Prestamo } from '../services/prestamo';

// Importa el modelo Abono
import { Abono } from '../services/abono';

// Importa el servicio de abonos para consultar historial
import { AbonoService } from '../services/abono.service';

// Configuración del componente
@Component({
  // Nombre del componente
  selector: 'app-prestamos',

  // Indica que el componente es independiente
  standalone: true,

  // Módulos que usa este componente
  imports: [CommonModule, FormsModule],

  // Archivo HTML conectado
  templateUrl: './prestamos.html',

  // Archivo CSS conectado
  styleUrl: './prestamos.css'
})

// Clase principal del componente
export class PrestamosComponent implements OnInit {

  // Lista donde se guardan todos los préstamos que llegan del backend
  prestamos: Prestamo[] = [];

  // Lista donde se guardan los abonos del préstamo seleccionado
  historialAbonos: Abono[] = [];

  // Guarda el id del préstamo al que se le está viendo el historial
  prestamoSeleccionadoHistorial: number | null = null;

  // Objeto que guarda los datos del formulario para solicitar préstamo
  nuevoPrestamo = {
    clienteId: '',
    monto: '',
    plazoMeses: '',
    interes: ''
  };

  // Guarda valores de abono por préstamo
  // Ejemplo: abonos[3] = "50000"
  abonos: { [key: number]: string } = {};

  // Guarda el usuario que inició sesión
  usuarioLogueado: any = null;

  // Constructor: Angular inyecta los servicios
  constructor(
    private prestamoService: PrestamoService,
    private abonoService: AbonoService
  ) { }

  // Método para ver historial de abonos de un préstamo
  verHistorial(prestamoId: number): void {

    // Guarda el id del préstamo seleccionado
    this.prestamoSeleccionadoHistorial = prestamoId;

    // Llama al backend para traer los abonos de ese préstamo
    this.abonoService.listarAbonosPorPrestamo(prestamoId).subscribe({

      // Si la respuesta llega bien
      next: (data: Abono[]) => {

        // Guarda los abonos en la lista del historial
        this.historialAbonos = data;
      },

      // Si ocurre error
      error: (err: any) => {
        console.error('Error al cargar historial de abonos', err);
      }
    });
  }

  // Método que se ejecuta automáticamente cuando se abre la vista
  ngOnInit(): void {

    // Carga todos los préstamos
    this.cargarPrestamos();

    // Verifica que exista window para poder usar localStorage
    if (typeof window !== 'undefined') {

      // Obtiene el usuario guardado en el navegador
      const usuarioGuardado = localStorage.getItem('usuarioLogueado');

      // Si existe usuario guardado
      if (usuarioGuardado) {

        // Convierte el JSON en objeto
        this.usuarioLogueado = JSON.parse(usuarioGuardado);
      }
    }
  }

  // Método para cargar todos los préstamos
  cargarPrestamos(): void {

    // Llama al backend mediante el servicio
    this.prestamoService.listarPrestamos().subscribe({

      // Si el backend responde correctamente
      next: (data: Prestamo[]) => {

        // Muestra los préstamos en consola para revisar
        console.log("PRESTAMOS FRONT:", data);

        // Guarda los préstamos en la variable
        this.prestamos = data;
      },

      // Si ocurre error
      error: (err: any) => {
        console.error('Error al cargar préstamos', err);
      }
    });
  }

  // Método para crear o solicitar préstamo
  crearPrestamo(): void {

    // Envía el objeto nuevoPrestamo al backend
    this.prestamoService.solicitarPrestamo(this.nuevoPrestamo).subscribe({

      // Si se crea correctamente
      next: () => {

        // Recarga la tabla de préstamos
        this.cargarPrestamos();

        // Limpia el formulario
        this.nuevoPrestamo = {
          clienteId: '',
          monto: '',
          plazoMeses: '',
          interes: ''
        };
      },

      // Si ocurre error
      error: (err: any) => {
        console.error('Error al crear préstamo', err);
      }
    });
  }

  // Método para aprobar préstamo
  aprobarPrestamo(id: number): void {

    // Llama al backend para cambiar estado a APROBADO
    this.prestamoService.aprobarPrestamo(id).subscribe({

      // Si se aprueba correctamente
      next: () => {

        // Recarga la lista
        this.cargarPrestamos();
      },

      // Si ocurre error
      error: (err: any) => {
        console.error('Error al aprobar préstamo', err);
      }
    });
  }

  // Método para rechazar préstamo
  rechazarPrestamo(id: number): void {

    // Llama al backend para cambiar estado a RECHAZADO
    this.prestamoService.rechazarPrestamo(id).subscribe({

      // Si se rechaza correctamente
      next: () => {

        // Recarga la lista
        this.cargarPrestamos();
      },

      // Si ocurre error
      error: (err: any) => {
        console.error('Error al rechazar préstamo', err);
      }
    });
  }

  // Método para pagar todo el saldo pendiente
  pagarTotal(prestamo: Prestamo): void {

    // Solo permite pagar si el préstamo está aprobado
    if (prestamo.estado !== 'APROBADO') {
      return;
    }

    // Toma el saldo pendiente completo
    const saldoTotal = prestamo.saldoPendiente;

    // Envía ese saldo como abono al backend
    this.prestamoService.abonarPrestamo(prestamo.id!, String(saldoTotal)).subscribe({

      // Si responde correctamente
      next: () => {

        // Recarga la lista de préstamos
        this.cargarPrestamos();

        // Limpia el campo de abono de ese préstamo
        this.abonos[prestamo.id!] = '';

        // Muestra alerta
        alert('Préstamo pagado completamente');
      },

      // Si ocurre error
      error: (err: any) => {
        console.error('Error al pagar total del préstamo', err);
      }
    });
  }

  // Método para calcular el porcentaje pagado
  calcularProgreso(prestamo: any): number {

    // Calcula el total con interés
    const total = prestamo.monto + (prestamo.monto * prestamo.interes);

    // Si el total es cero, retorna 0 para evitar división por cero
    if (total === 0) return 0;

    // Calcula cuánto se ha pagado
    const pagado = total - prestamo.saldoPendiente;

    // Devuelve porcentaje pagado
    return (pagado / total) * 100;
  }

  // Método para mostrar dinero con formato colombiano
  formatearDinero(valor: number): string {

    // Convierte número a formato moneda
    return '$' + valor.toLocaleString('es-CO', {});
  }

  // Método para abonar a un préstamo
  abonarPrestamo(id: number): void {

    // Toma el valor escrito en el input del préstamo
    const abono = Number(this.abonos[id]);

    // Valida que sea mayor a cero
    if (!abono || abono <= 0) {

      // Muestra alerta
      alert("El abono debe ser mayor a 0");

      // Detiene ejecución
      return;
    }

    // Envía el abono al backend
    this.prestamoService.abonarPrestamo(id, abono.toString()).subscribe({

      // Si se envía correctamente
      next: () => {

        // Recarga préstamos
        this.cargarPrestamos();

        // Limpia input del abono
        this.abonos[id] = '';
      },

      // Si ocurre error
      error: (err: any) => {
        console.error('Error al abonar préstamo', err);
      }
    });
  }

  // Verifica si el usuario logueado es administrador
  esAdmin(): boolean {

    // Retorna true si existe usuario y su rol es administrador
    return this.usuarioLogueado !== null && this.usuarioLogueado.rol === 'administrador';
  }

  // Verifica si el usuario logueado es empleado
  esEmpleado(): boolean {

    // Retorna true si existe usuario y su rol es empleado
    return this.usuarioLogueado !== null && this.usuarioLogueado.rol === 'empleado';
  }
}
