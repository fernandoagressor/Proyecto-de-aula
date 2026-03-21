import { Component, OnInit } from '@angular/core';
import { UsuariosService, Usuario } from './usuarios';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  usuarios: Usuario[] = [];

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.usuariosService.obtenerUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
      },
      error: (err: unknown) => {
        console.error('Error al cargar usuarios', err);
      },
    });
  }
}
