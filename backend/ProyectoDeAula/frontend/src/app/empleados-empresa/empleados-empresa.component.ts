import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EmpleadoEmpresaService } from '../services/empleado-empresa.service';

interface EmpleadoEmpresa {
  id: number;
  empresaId?: number;
  nombre: string;
  cedula: string;
  cargo: string;
  telefono: string;
  correo: string;
  estado: 'ACTIVO' | 'INACTIVO';
  usuarioAcceso: string;
  passwordTemporal: string;
}

@Component({
  selector: 'app-empleados-empresa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empleados-empresa.component.html',
  styleUrls: ['./empleados-empresa.component.css']
})
export class EmpleadosEmpresaComponent implements OnInit {

  empleados: EmpleadoEmpresa[] = [];
  busqueda: string = '';
  empleadoEditando: EmpleadoEmpresa | null = null;

  nuevoEmpleado: EmpleadoEmpresa = {
    id: 0,
    nombre: '',
    cedula: '',
    cargo: '',
    telefono: '',
    correo: '',
    estado: 'ACTIVO',
    usuarioAcceso: '',
    passwordTemporal: ''
  };

  toastVisible: boolean = false;
  toastMensaje: string = '';
  toastTipo: 'success' | 'error' | 'warning' | 'info' = 'info';

  constructor(
    private empleadoEmpresaService: EmpleadoEmpresaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  obtenerEmpresaIdLogueada(): number | null {
    const usuarioLogueado = JSON.parse(
      localStorage.getItem('usuarioLogueado') || '{}'
    );

    const rol = (
      usuarioLogueado?.rol ||
      usuarioLogueado?.tipoUsuario ||
      ''
    ).toLowerCase();

    const empresaId =
      usuarioLogueado?.empresaId ||
      usuarioLogueado?.idEmpresa ||
      usuarioLogueado?.empresa?.id ||
      (rol === 'empresa' ? usuarioLogueado?.id : null);

    return empresaId ? Number(empresaId) : null;
  }

  cargarEmpleados(): void {
    const empresaId = this.obtenerEmpresaIdLogueada();

    if (!empresaId) {
      this.empleados = [];

      this.mostrarToast(
        'No se encontró la empresa logueada.',
        'warning'
      );

      this.cdr.detectChanges();
      return;
    }

    this.empleadoEmpresaService.listarPorEmpresa(empresaId).subscribe({
      next: (data: EmpleadoEmpresa[]) => {
        this.empleados = data || [];
        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Error cargando empleados', err);

        this.empleados = [];

        this.mostrarToast(
          'No fue posible cargar los empleados.',
          'error'
        );

        this.cdr.detectChanges();
      }
    });
  }

  crearEmpleado(): void {
    if (
      !this.nuevoEmpleado.nombre ||
      !this.nuevoEmpleado.cedula ||
      !this.nuevoEmpleado.cargo ||
      !this.nuevoEmpleado.telefono ||
      !this.nuevoEmpleado.correo
    ) {
      this.mostrarToast(
        'Completa todos los campos del empleado.',
        'warning'
      );

      return;
    }

    const empresaId = this.obtenerEmpresaIdLogueada();

    if (!empresaId) {
      this.mostrarToast(
        'No se encontró el ID de la empresa.',
        'error'
      );

      return;
    }

    const usuarioGenerado = this.generarUsuarioEmpleado(
      this.nuevoEmpleado.nombre,
      this.nuevoEmpleado.cedula
    );

    const passwordGenerado = this.generarPasswordEmpleado(
      this.nuevoEmpleado.cedula
    );

    const empleadoCrear: any = {
      empresaId: empresaId,
      nombre: this.nuevoEmpleado.nombre,
      cedula: this.nuevoEmpleado.cedula,
      cargo: this.nuevoEmpleado.cargo,
      telefono: this.nuevoEmpleado.telefono,
      correo: this.nuevoEmpleado.correo,
      estado: 'ACTIVO',
      usuarioAcceso: usuarioGenerado,
      passwordTemporal: passwordGenerado,
      rol: 'empleado_empresa'
    };

    this.empleadoEmpresaService.crearEmpleado(empleadoCrear).subscribe({
      next: () => {
        this.cargarEmpleados();
        this.limpiarFormulario();

        this.mostrarToast(
          `Empleado creado. Usuario: ${usuarioGenerado} | Contraseña: ${passwordGenerado}`,
          'success'
        );

        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Error creando empleado', err);

        this.mostrarToast(
          'No se pudo crear el empleado.',
          'error'
        );

        this.cdr.detectChanges();
      }
    });
  }

  editarEmpleado(empleado: EmpleadoEmpresa): void {
    this.empleadoEditando = empleado;

    this.nuevoEmpleado = {
      ...empleado
    };

    setTimeout(() => {
      const formulario = document.getElementById('formEmpleado');

      if (formulario) {
        formulario.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
  }

  actualizarEmpleado(): void {
    if (!this.empleadoEditando) {
      this.mostrarToast(
        'No hay un empleado seleccionado.',
        'warning'
      );

      return;
    }

    const empresaId =
      this.empleadoEditando.empresaId ||
      this.obtenerEmpresaIdLogueada();

    if (!empresaId) {
      this.mostrarToast(
        'No se encontró la empresa del empleado.',
        'error'
      );

      return;
    }

    const empleadoActualizar = {
      ...this.nuevoEmpleado,
      empresaId: empresaId
    };

    this.empleadoEmpresaService
      .actualizarEmpleado(this.empleadoEditando.id, empleadoActualizar)
      .subscribe({
        next: () => {
          this.cargarEmpleados();
          this.cancelarEdicion();

          this.mostrarToast(
            'Empleado actualizado correctamente.',
            'success'
          );

          this.cdr.detectChanges();
        },

        error: (err: any) => {
          console.error('Error actualizando empleado', err);

          this.mostrarToast(
            'No se pudo actualizar el empleado.',
            'error'
          );

          this.cdr.detectChanges();
        }
      });
  }

  eliminarEmpleado(id: number): void {
    const confirmar = confirm(
      '¿Seguro que deseas eliminar este empleado?'
    );

    if (!confirmar) {
      return;
    }

    this.empleadoEmpresaService.eliminarEmpleado(id).subscribe({
      next: () => {
        this.cargarEmpleados();

        this.mostrarToast(
          'Empleado eliminado correctamente.',
          'success'
        );

        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Error eliminando empleado', err);

        this.mostrarToast(
          'No se pudo eliminar el empleado.',
          'error'
        );

        this.cdr.detectChanges();
      }
    });
  }

  cambiarEstado(empleado: EmpleadoEmpresa): void {
    const empleadoActualizado: EmpleadoEmpresa = {
      ...empleado,
      estado: empleado.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO'
    };

    this.actualizarEmpleadoEstado(empleadoActualizado);
  }

  actualizarEmpleadoEstado(empleado: EmpleadoEmpresa): void {
    this.empleadoEmpresaService.actualizarEmpleado(empleado.id, empleado).subscribe({
      next: () => {
        this.cargarEmpleados();

        this.mostrarToast(
          'Estado actualizado correctamente.',
          'success'
        );

        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Error actualizando estado', err);

        this.mostrarToast(
          'No se pudo actualizar el estado.',
          'error'
        );

        this.cdr.detectChanges();
      }
    });
  }

  cancelarEdicion(): void {
    this.empleadoEditando = null;
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.nuevoEmpleado = {
      id: 0,
      nombre: '',
      cedula: '',
      cargo: '',
      telefono: '',
      correo: '',
      estado: 'ACTIVO',
      usuarioAcceso: '',
      passwordTemporal: ''
    };
  }

  generarUsuarioEmpleado(nombre: string, cedula: string): string {
    const nombreLimpio = nombre
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 ]/g, '');

    const partes = nombreLimpio
      .split(' ')
      .filter(p => p.length > 0);

    const primerNombre = partes[0] || 'empleado';
    const ultimosCedula = cedula.slice(-4);

    return `${primerNombre}${ultimosCedula}`;
  }

  generarPasswordEmpleado(cedula: string): string {
    const ultimosCedula = cedula.slice(-4);
    return `Pf${ultimosCedula}*`;
  }

  obtenerEmpleadosFiltrados(): EmpleadoEmpresa[] {
    const texto = this.busqueda.trim().toLowerCase();

    if (!texto) {
      return this.empleados;
    }

    return this.empleados.filter((empleado: EmpleadoEmpresa) => {
      return (
        String(empleado.id).includes(texto) ||
        empleado.nombre.toLowerCase().includes(texto) ||
        empleado.cedula.toLowerCase().includes(texto) ||
        empleado.cargo.toLowerCase().includes(texto) ||
        empleado.correo.toLowerCase().includes(texto) ||
        empleado.estado.toLowerCase().includes(texto) ||
        empleado.usuarioAcceso.toLowerCase().includes(texto)
      );
    });
  }

  contarPorEstado(estado: 'ACTIVO' | 'INACTIVO'): number {
    return this.empleados.filter(e => e.estado === estado).length;
  }

  obtenerInicialEmpleado(empleado: EmpleadoEmpresa): string {
    const nombre = empleado?.nombre || 'E';
    return nombre.charAt(0).toUpperCase();
  }

  mostrarToast(
    mensaje: string,
    tipo: 'success' | 'error' | 'warning' | 'info' = 'info'
  ): void {
    this.toastMensaje = mensaje;
    this.toastTipo = tipo;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
      this.cdr.detectChanges();
    }, 5200);
  }
}
