import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Prestamo } from './prestamo';
import { Abono } from './abono';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  private apiUrl = 'http://localhost:8080/api/prestamos';
  private abonosUrl = 'http://localhost:8080/api/abonos';

  constructor(private http: HttpClient) {}

  // ADMIN GENERAL
  listarPrestamos(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(this.apiUrl);
  }

  // ADMIN: solo préstamos de clientes
  listarPrestamosClientes(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(`${this.apiUrl}/clientes`);
  }

  // CLIENTE: préstamos de un cliente específico
  listarPorCliente(clienteId: number): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  // EMPLEADO: préstamos propios del empleado
  listarPorEmpleado(empleadoId: number): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(`${this.apiUrl}/empleado/${empleadoId}`);
  }

  // EMPRESA: todos los préstamos asociados a una empresa
  listarPorEmpresa(empresaId: number): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(`${this.apiUrl}/empresa/${empresaId}`);
  }

  // EMPRESA: solo préstamos de empleados
  listarPrestamosEmpleadosPorEmpresa(empresaId: number): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(
      `${this.apiUrl}/empresa/${empresaId}/empleados`
    );
  }

  obtenerPrestamoPorId(id: number): Observable<Prestamo> {
    return this.http.get<Prestamo>(`${this.apiUrl}/${id}`);
  }

  solicitarPrestamo(datos: {
    clienteId: string;
    monto: string;
    plazoMeses: string;
  }): Observable<Prestamo> {
    return this.http.post<Prestamo>(`${this.apiUrl}/solicitar`, {
      clienteId: Number(datos.clienteId),
      monto: Number(datos.monto),
      plazoMeses: Number(datos.plazoMeses)
    });
  }

  solicitarPrestamoEmpleado(datos: {
    empleadoId: string;
    empresaId: string;
    monto: string;
    plazoMeses: string;
  }): Observable<Prestamo> {
    return this.http.post<Prestamo>(`${this.apiUrl}/solicitar-empleado`, {
      empleadoId: Number(datos.empleadoId),
      empresaId: Number(datos.empresaId),
      monto: Number(datos.monto),
      plazoMeses: Number(datos.plazoMeses)
    });
  }

  aprobarPrestamo(id: number): Observable<Prestamo> {
    return this.http.put<Prestamo>(`${this.apiUrl}/${id}/aprobar`, {});
  }

  rechazarPrestamo(id: number): Observable<Prestamo> {
    return this.http.put<Prestamo>(`${this.apiUrl}/${id}/rechazar`, {});
  }

  abonarPrestamo(id: number, abono: string): Observable<Abono> {
    return this.http.put<Abono>(`${this.apiUrl}/${id}/abonar`, {
      abono: Number(abono)
    });
  }

  aprobarAbono(abonoId: number): Observable<Abono> {
    return this.http.put<Abono>(`${this.apiUrl}/abonos/${abonoId}/aprobar`, {});
  }

  rechazarAbono(abonoId: number): Observable<Abono> {
    return this.http.put<Abono>(`${this.apiUrl}/abonos/${abonoId}/rechazar`, {});
  }

  pagarPorPse(prestamoId: number, monto: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${prestamoId}/pagar-pse`, {
      monto: Number(monto)
    });
  }

  descargarComprobanteAbono(abonoId: number): Observable<Blob> {
    return this.http.get(`${this.abonosUrl}/${abonoId}/comprobante`, {
      responseType: 'blob'
    });
  }

  abrirComprobanteAbono(abonoId: number): void {
    const url = `${this.abonosUrl}/${abonoId}/comprobante`;
    window.open(url, '_blank');
  }
}
