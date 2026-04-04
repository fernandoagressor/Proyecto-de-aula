import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfiguracionService } from '../services/configuracion.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css'
})
export class ConfiguracionComponent implements OnInit {

  tasaInteres: string = '';

  constructor(private configuracionService: ConfiguracionService) {}

  ngOnInit(): void {
    this.cargarConfiguracion();
  }

  cargarConfiguracion(): void {
    this.configuracionService.obtenerConfiguracion().subscribe({
      next: (data) => {
        this.tasaInteres = String(data.tasaInteres);
      },
      error: (err: any) => {
        console.error('Error al cargar configuración', err);
      }
    });
  }

  guardarTasa(): void {
    this.configuracionService.actualizarTasa(this.tasaInteres).subscribe({
      next: (data) => {
        this.tasaInteres = String(data.tasaInteres);
        alert('Tasa actualizada correctamente');
      },
      error: (err: any) => {
        console.error('Error al actualizar tasa', err);
      }
    });
  }
}
