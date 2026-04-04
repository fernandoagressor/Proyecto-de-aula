import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrestamoService } from '../services/prestamo.service';
import { Prestamo } from '../services/prestamo';

@Component({
  selector: 'app-mis-prestamos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-prestamos.html',
  styleUrl: './mis-prestamos.css'
})
export class MisPrestamosComponent implements OnInit {

  prestamos: Prestamo[] = [];
  usuarioLogueado: any = null;

  constructor(private prestamoService: PrestamoService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const usuarioGuardado = localStorage.getItem('usuarioLogueado');

      if (usuarioGuardado) {
        this.usuarioLogueado = JSON.parse(usuarioGuardado);

        if (this.usuarioLogueado?.clienteId) {
          this.cargarMisPrestamos(this.usuarioLogueado.clienteId);
        }
      }
    }
  }

  cargarMisPrestamos(clienteId: number): void {
    this.prestamoService.listarPrestamosPorCliente(clienteId).subscribe({
      next: (data: Prestamo[]) => {
        this.prestamos = data;
      },
      error: (err: any) => {
        console.error('Error al cargar mis préstamos', err);
      }
    });
  }
}
