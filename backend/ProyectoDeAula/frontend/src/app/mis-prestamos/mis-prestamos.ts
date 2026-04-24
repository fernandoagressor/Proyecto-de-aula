// Importa Component, OnInit y ChangeDetectorRef desde Angular
// Component: permite crear el componente
// OnInit: permite ejecutar código cuando carga la pantalla
// ChangeDetectorRef: ayuda a actualizar la vista manualmente
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

// Importa CommonModule para usar directivas como *ngIf y *ngFor
import { CommonModule } from '@angular/common';

// Importa FormsModule para usar [(ngModel)] en los formularios
import { FormsModule } from '@angular/forms';

// Importa el servicio de préstamos para comunicarse con el backend
import { PrestamoService } from '../services/prestamo.service';

// Importa el modelo Prestamo
import { Prestamo } from '../services/prestamo';

// Importa el servicio de abonos para consultar historial
import { AbonoService } from '../services/abono.service';

// Importa el modelo Abono
import { Abono } from '../services/abono';

// Decorador que configura el componente
@Component({
  // Nombre del componente
  selector: 'app-mis-prestamos',

  // Indica que es standalone
  standalone: true,

  // Módulos que usa este componente
  imports: [CommonModule, FormsModule],

  // Archivo HTML conectado
  templateUrl: './mis-prestamos.html',

  // Archivo CSS conectado
  styleUrls: ['./mis-prestamos.css']
})

// Clase principal del componente
export class MisPrestamosComponent implements OnInit {

  // Lista donde se guardan los préstamos del cliente
  prestamos: Prestamo[] = [];

  // Guarda el usuario que inició sesión
  usuarioLogueado: any = null;

  // Objeto para guardar el valor del abono por cada préstamo
  // Ejemplo: abonos[5] = "50000"
  abonos: { [key: number]: string } = {};

  // Lista donde se guarda el historial de abonos de un préstamo
  historialAbonos: Abono[] = [];

  // Guarda el id del préstamo seleccionado para ver historial
  prestamoSeleccionadoHistorial: number | null = null;

  // Mensaje que se muestra en pantalla
  mensaje: string = '';

  // Constructor: Angular inyecta los servicios
  constructor(
    private prestamoService: PrestamoService,
    private abonoService: AbonoService,
    private cd: ChangeDetectorRef
  ) {}

  // Se ejecuta automáticamente cuando abre la vista
  ngOnInit(): void {

    // Obtiene el usuario guardado en localStorage
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

    // Si existe un usuario guardado
    if (usuarioGuardado) {

      // Convierte el texto JSON en objeto
      this.usuarioLogueado = JSON.parse(usuarioGuardado);

      // Si el usuario tiene clienteId
      if (this.usuarioLogueado.clienteId) {

        // Carga los préstamos de ese cliente
        this.cargarMisPrestamos(this.usuarioLogueado.clienteId);
      }
    }
  }

  // Método para cargar préstamos del cliente
  cargarMisPrestamos(clienteId: number): void {

    // Llama al backend para listar préstamos por cliente
    this.prestamoService.listarPorCliente(clienteId).subscribe({

      // Si la respuesta es correcta
      next: (data: Prestamo[]) => {

        // Guarda los préstamos en la variable
        this.prestamos = data;

        // Fuerza actualización de la vista
        this.cd.detectChanges();
      },

      // Si ocurre error
      error: (err: any) => {
        console.error('Error al cargar mis préstamos', err);
      }
    });
  }

  // Método para abonar a un préstamo
  abonarPrestamo(id: number): void {

    // Toma el valor escrito en el input de ese préstamo
    const valorAbono = this.abonos[id];

    // Valida que el usuario haya escrito algo
    if (!valorAbono || valorAbono.trim() === '') {
      this.mensaje = 'Debes escribir un valor para abonar';
      return;
    }

    // Convierte el valor escrito a número
    const abonoNumero = Number(valorAbono);

    // Valida que sea número y mayor que cero
    if (isNaN(abonoNumero) || abonoNumero <= 0) {
      this.mensaje = 'El abono debe ser mayor a 0';
      return;
    }

    // Envía el abono al backend
    this.prestamoService.abonarPrestamo(id, valorAbono).subscribe({

      // Si el backend responde correctamente
      next: () => {

        // Muestra mensaje
        this.mensaje = 'Abono enviado. Queda pendiente de aprobación del administrador';

        // Limpia el input de ese préstamo
        this.abonos[id] = '';

        // Recarga los préstamos del cliente
        this.cargarMisPrestamos(this.usuarioLogueado.clienteId);
      },

      // Si ocurre error
      error: (err: any) => {
        console.error('Error al abonar préstamo', err);
        this.mensaje = err?.error?.message || 'No se pudo realizar el abono';
      }
    });
  }

  // Método para pagar todo el saldo pendiente
  pagarTotal(prestamo: Prestamo): void {

    // Verifica si el préstamo permite abonar
    if (!this.puedeAbonar(prestamo.estado)) {
      return;
    }

    // Obtiene el saldo pendiente total
    const saldoTotal = prestamo.saldoPendiente;

    // Envía como abono el saldo completo
    this.prestamoService.abonarPrestamo(prestamo.id!, String(saldoTotal)).subscribe({

      // Si responde correctamente
      next: () => {

        // Mensaje de confirmación
        this.mensaje = 'Solicitud de pago total enviada. Queda pendiente de aprobación del administrador';

        // Limpia el input
        this.abonos[prestamo.id!] = '';

        // Recarga préstamos
        this.cargarMisPrestamos(this.usuarioLogueado.clienteId);
      },

      // Si ocurre error
      error: (err: any) => {
        console.error('Error al pagar total del préstamo', err);
        this.mensaje = err?.error?.message || 'No se pudo pagar el préstamo completo';
      }
    });
  }

  // Método para ver historial de abonos de un préstamo
  verHistorial(prestamoId: number): void {

    // Guarda el préstamo seleccionado
    this.prestamoSeleccionadoHistorial = prestamoId;

    // Consulta los abonos de ese préstamo en el backend
    this.abonoService.listarAbonosPorPrestamo(prestamoId).subscribe({

      // Si llegan datos
      next: (data: Abono[]) => {

        // Guarda el historial en la variable
        this.historialAbonos = data;

        // Actualiza la vista
        this.cd.detectChanges();
      },

      // Si ocurre error
      error: (err: any) => {
        console.error('Error al cargar historial de abonos', err);
      }
    });
  }

  // Método que indica si se puede abonar
  puedeAbonar(estado: string): boolean {

    // Solo se puede abonar si el préstamo está APROBADO
    return estado === 'APROBADO';
  }

  // Calcula el porcentaje pagado del préstamo
  calcularProgreso(prestamo: Prestamo): number {

    // Calcula el total con interés
    const total = prestamo.monto + (prestamo.monto * prestamo.interes);

    // Si el total es cero o negativo, retorna 0
    if (total <= 0) {
      return 0;
    }

    // Calcula cuánto se ha pagado
    const pagado = total - prestamo.saldoPendiente;

    // Convierte lo pagado en porcentaje
    // Math.max evita negativos
    // Math.min evita que pase de 100
    return Math.max(0, Math.min(100, (pagado / total) * 100));
  }

  // Formatea dinero en pesos colombianos
  formatearDinero(valor: number): string {

    // Convierte el número a formato colombiano
    return '$ ' + valor.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }
}
