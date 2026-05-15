import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
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
  timeline: any[] = [];

  totalPrestamos: number = 0;
  totalPrestado: number = 0;
  saldoPendiente: number = 0;
  totalAbonado: number = 0;

  usuarioLogueado: any = null;
  cargando: boolean = true;

  tipoDashboard: 'admin' | 'cliente' | 'empleado_empresa' | 'empresa' = 'admin';

  constructor(
    private prestamoService: PrestamoService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
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
      this.cargando = false;
      this.cdr.detectChanges();
      return;
    }

    this.usuarioLogueado = JSON.parse(usuario);

    const rol = (
      this.usuarioLogueado?.rol ||
      this.usuarioLogueado?.tipoUsuario ||
      ''
    ).toLowerCase();

    // =============================
    // DASHBOARD CLIENTE
    // =============================
    if (rol === 'cliente') {
      this.tipoDashboard = 'cliente';

      const clienteId =
        this.usuarioLogueado?.clienteId ||
        this.usuarioLogueado?.idCliente ||
        this.usuarioLogueado?.cliente?.id;

      if (!clienteId) {
        this.calcularResumen([]);
        this.cargando = false;
        this.cdr.detectChanges();
        return;
      }

      this.prestamoService.listarPorCliente(Number(clienteId)).subscribe({
        next: (data: Prestamo[]) => {
          this.calcularResumen(data || []);
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error cargando dashboard cliente', err);
          this.calcularResumen([]);
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });

      return;
    }

    // =============================
    // DASHBOARD EMPLEADO EMPRESA
    // =============================
    if (rol === 'empleado_empresa') {
      this.tipoDashboard = 'empleado_empresa';

      const empleadoId =
        this.usuarioLogueado?.empleadoId ||
        this.usuarioLogueado?.idEmpleado ||
        this.usuarioLogueado?.empleado?.id;

      if (!empleadoId) {
        this.calcularResumen([]);
        this.cargando = false;
        this.cdr.detectChanges();
        return;
      }

      this.prestamoService.listarPorEmpleado(Number(empleadoId)).subscribe({
        next: (data: Prestamo[]) => {
          const prestamosEmpleado = (data || []).filter((p: any) => {
            return (
              p.empleado ||
              p.empleadoId ||
              p.idEmpleado ||
              p.empleadoNombre ||
              p.tipoPrestamo === 'EMPLEADO'
            );
          });

          this.calcularResumen(prestamosEmpleado);
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error cargando dashboard empleado empresa', err);
          this.calcularResumen([]);
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });

      return;
    }

    // =============================
    // DASHBOARD EMPRESA
    // =============================
    if (rol === 'empresa') {
      this.tipoDashboard = 'empresa';

      const empresaId =
        this.usuarioLogueado?.empresaId ||
        this.usuarioLogueado?.idEmpresa ||
        this.usuarioLogueado?.empresa?.id ||
        this.usuarioLogueado?.id;

      if (!empresaId) {
        this.calcularResumen([]);
        this.cargando = false;
        this.cdr.detectChanges();
        return;
      }

      this.prestamoService.listarPorEmpresa(Number(empresaId)).subscribe({
        next: (data: Prestamo[]) => {
          const prestamosEmpresa = (data || []).filter((p: any) => {
            return (
              p.empleado ||
              p.empleadoId ||
              p.idEmpleado ||
              p.empleadoNombre ||
              p.tipoPrestamo === 'EMPLEADO'
            );
          });

          this.calcularResumen(prestamosEmpresa);
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error cargando dashboard empresa', err);
          this.calcularResumen([]);
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });

      return;
    }

    // =============================
    // DASHBOARD ADMIN / EMPLEADO PF
    // =============================
    this.tipoDashboard = 'admin';

    this.prestamoService.listarPrestamos().subscribe({
      next: (data: Prestamo[]) => {
        this.calcularResumen(data || []);
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error cargando dashboard general', err);
        this.calcularResumen([]);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  calcularResumen(data: Prestamo[]): void {
    this.prestamos = data || [];

    this.totalPrestamos = this.prestamos.length;

    this.totalPrestado = this.prestamos.reduce(
      (sum: number, p: any) => sum + Number(p.monto || 0),
      0
    );

    this.saldoPendiente = this.prestamos.reduce(
      (sum: number, p: any) => sum + Number(p.saldoPendiente || 0),
      0
    );

    this.totalAbonado = this.prestamos.reduce((sum: number, p: any) => {
      const monto = Number(p.monto || 0);
      const interes = Number(p.interes || 0);
      const saldo = Number(p.saldoPendiente || 0);

      const totalConInteres = monto + (monto * interes);
      const abonado = totalConInteres - saldo;

      return sum + Math.max(abonado, 0);

    }, 0);
    this.generarTimeline();
  }

  porcentajePagado(): number {
    const total = this.totalAbonado + this.saldoPendiente;

    if (total <= 0) {
      return 0;
    }

    return Math.round((this.totalAbonado / total) * 100);
  }

  porcentajePendiente(): number {
    const porcentaje = 100 - this.porcentajePagado();

    if (porcentaje < 0) {
      return 0;
    }

    if (porcentaje > 100) {
      return 100;
    }

    return porcentaje;
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

  esCliente(): boolean {
    return this.tipoDashboard === 'cliente';
  }

  esEmpleadoEmpresa(): boolean {
    return this.tipoDashboard === 'empleado_empresa';
  }

  esEmpresa(): boolean {
    return this.tipoDashboard === 'empresa';
  }

  esAdmin(): boolean {
    return this.tipoDashboard === 'admin';
  }

  obtenerTituloDashboard(): string {
    if (this.esEmpresa()) {
      return 'Dashboard empresa';
    }

    if (this.esEmpleadoEmpresa()) {
      return 'Dashboard empleado';
    }

    if (this.esCliente()) {
      return 'Dashboard cliente';
    }

    return 'Dashboard general';
  }

  obtenerDescripcionDashboard(): string {
    if (this.esEmpresa()) {
      return 'Consulta el resumen de préstamos internos, empleados, pagos y cartera de tu empresa.';
    }

    if (this.esEmpleadoEmpresa()) {
      return 'Consulta el resumen de tus préstamos internos, pagos y saldo pendiente.';
    }

    if (this.esCliente()) {
      return 'Consulta el resumen de tus préstamos, pagos y saldo pendiente.';
    }

    return 'Consulta el resumen general de préstamos, cartera y pagos del sistema.';
  }

  irOperaciones(): void {
    if (this.esEmpresa()) {
      this.router.navigate(['/empresa/prestamos-empleados']);
      return;
    }

    if (this.esEmpleadoEmpresa()) {
      this.router.navigate(['/empleado/mis-prestamos']);
      return;
    }

    if (this.esCliente()) {
      this.router.navigate(['/mis-prestamos']);
      return;
    }

    this.router.navigate(['/prestamos']);
  }

  obtenerNombreMovimiento(prestamo: any): string {
    if (this.esEmpleadoEmpresa()) {
      return 'Empleado: ' + (this.usuarioLogueado?.nombre || 'Empleado');
    }

    if (this.esEmpresa()) {
      return 'Empleado: ' + (
        prestamo?.empleado?.nombre ||
        prestamo?.empleadoNombre ||
        'Empleado no asignado'
      );
    }

    if (this.esCliente()) {
      return 'Cliente: ' + (this.usuarioLogueado?.nombre || 'Cliente');
    }

    return 'Cliente: ' + (
      prestamo?.cliente?.nombre ||
      prestamo?.clienteNombre ||
      'Cliente no asignado'
    );
  }

  irPagos(): void {
    if (this.esEmpresa()) {
      this.router.navigate(['/empresa/prestamos-empleados']);
      return;
    }

    if (this.esEmpleadoEmpresa()) {
      this.router.navigate(['/empleado/mis-prestamos']);
      return;
    }

    if (this.esCliente()) {
      this.router.navigate(['/mis-prestamos']);
      return;
    }

    this.router.navigate(['/prestamos']);
  }

  irComprobantes(): void {
    if (this.esEmpleadoEmpresa()) {
      this.router.navigate(['/empleado/mis-prestamos']);
      return;
    }

    if (this.esCliente()) {
      this.router.navigate(['/mis-prestamos']);
      return;
    }

    if (this.esEmpresa()) {
      this.router.navigate(['/empresa/prestamos-empleados']);
      return;
    }

    this.router.navigate(['/prestamos']);
  }

  textoAccesoPrestamos(): string {
    if (this.esEmpresa()) {
      return 'Préstamos empleados';
    }

    if (this.esEmpleadoEmpresa()) {
      return 'Mis préstamos';
    }

    if (this.esCliente()) {
      return 'Mis préstamos';
    }

    return 'Préstamos';
  }

  generarTimeline(): void {

    this.timeline = [];

    this.prestamos.forEach((prestamo: any) => {

      // PRÉSTAMO CREADO

      this.timeline.push({
        tipo: 'CREADO',
        titulo: `Préstamo #${prestamo.id} registrado`,
        descripcion: this.obtenerNombreMovimiento(prestamo),
        fecha:
          prestamo.fechaCreacion ||
          prestamo.fecha ||
          new Date(),
        estado: 'info',
        monto: prestamo.monto || 0
      });

      // APROBADO

      if (prestamo.estado === 'APROBADO') {

        this.timeline.push({
          tipo: 'APROBADO',
          titulo: `Préstamo #${prestamo.id} aprobado`,
          descripcion: 'Solicitud aprobada correctamente',
          fecha:
            prestamo.fechaAprobacion ||
            prestamo.fecha ||
            new Date(),
          estado: 'success',
          monto: prestamo.monto || 0
        });
      }

      // PAGADO

      if (prestamo.estado === 'PAGADO') {

        this.timeline.push({
          tipo: 'PAGADO',
          titulo: `Préstamo #${prestamo.id} pagado`,
          descripcion: 'Saldo liquidado completamente',
          fecha:
            prestamo.fechaPago ||
            prestamo.fecha ||
            new Date(),
          estado: 'paid',
          monto: prestamo.monto || 0
        });
      }

      // RECHAZADO

      if (prestamo.estado === 'RECHAZADO') {

        this.timeline.push({
          tipo: 'RECHAZADO',
          titulo: `Préstamo #${prestamo.id} rechazado`,
          descripcion: 'Solicitud rechazada',
          fecha:
            prestamo.fechaRechazo ||
            prestamo.fecha ||
            new Date(),
          estado: 'danger',
          monto: prestamo.monto || 0
        });
      }

    });

    // ORDENAR MÁS RECIENTE

    this.timeline.sort((a: any, b: any) => {
      return new Date(b.fecha).getTime() -
             new Date(a.fecha).getTime();
    });

    // SOLO 8

    this.timeline = this.timeline.slice(0, 8);
  }
}
