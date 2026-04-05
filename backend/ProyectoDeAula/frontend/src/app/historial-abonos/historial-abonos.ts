import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbonoService } from '../services/abono.service';
import { Abono } from '../services/abono';

@Component({
  selector: 'app-historial-abonos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-abonos.html',
  styleUrls: ['./historial-abonos.css']
})
export class HistorialAbonosComponent implements OnInit {

  abonos: Abono[] = [];
  cargando: boolean = true;

  constructor(private abonoService: AbonoService) {}

  ngOnInit(): void {
    this.cargarAbonos();
  }

  cargarAbonos(): void {
    this.abonoService.listarAbonos().subscribe({
      next: (data: Abono[]) => {
        this.abonos = data;
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al cargar historial de abonos', err);
        this.cargando = false;
      }
    });
  }

  formatearDinero(valor: number): string {
    return '$ ' + valor.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }
}
