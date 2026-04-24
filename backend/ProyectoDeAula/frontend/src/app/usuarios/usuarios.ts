// Importa el decorador Component y la interfaz OnInit
import { Component, OnInit } from '@angular/core';

// Permite usar directivas como *ngIf y *ngFor
import { CommonModule } from '@angular/common';

// Permite usar [(ngModel)] en inputs
import { FormsModule } from '@angular/forms';

// Servicio para comunicarse con el backend
import { UsuarioService } from '../services/usuario.service';


// Decorador del componente
@Component({

  // Nombre de la etiqueta HTML
  selector: 'app-usuarios',

  // Indica que es standalone (no necesita módulo)
  standalone: true,

  // Módulos que usa el componente
  imports: [CommonModule, FormsModule],

  // Archivo HTML
  templateUrl: './usuarios.html',

  // Archivo CSS
  styleUrls: ['./usuarios.css']
})
export class UsuariosComponent implements OnInit {

  // Array donde se guardan los usuarios del backend
  usuarios: any[] = [];

  // Objeto que representa el formulario
  nuevoUsuario = {
    nombre: '',     // nombre del usuario
    password: '',   // contraseña
    rol: ''         // rol (admin, empleado, cliente)
  };

  // Variable para controlar si estamos editando un usuario
  usuarioEditando: any = null;

  // Constructor: inyecta el servicio
  constructor(private usuarioService: UsuarioService) {}

  // Método que se ejecuta cuando carga el componente
  ngOnInit(): void {

    // Carga los usuarios al iniciar
    this.cargarUsuarios();
  }

  // Método para obtener usuarios del backend
  cargarUsuarios(): void {

    this.usuarioService.listarUsuarios().subscribe({

      // Cuando llega la respuesta correcta
      next: (data: any[]) => {

        // Guarda los datos en el array
        this.usuarios = data;
      },

      // Si ocurre error
      error: (err: any) => {

        console.error('Error al cargar usuarios', err);
      }
    });
  }

  // Método para crear un usuario
  crearUsuario(): void {

    // Validación: campos obligatorios
    if (
      !this.nuevoUsuario.nombre ||
      !this.nuevoUsuario.password ||
      !this.nuevoUsuario.rol
    ) {
      return;
    }

    // Llama al backend para guardar
    this.usuarioService.crearUsuario(this.nuevoUsuario).subscribe({

      next: () => {

        // Recarga lista de usuarios
        this.cargarUsuarios();

        // Limpia formulario
        this.limpiarFormulario();
      },

      error: (err: any) => {

        console.error('Error al crear usuario', err);
      }
    });
  }

  // Método para editar un usuario
  editarUsuario(usuario: any): void {

    // Guarda el usuario seleccionado
    this.usuarioEditando = usuario;

    // Copia los datos al formulario
    this.nuevoUsuario = {
      nombre: usuario.nombre,
      password: '', // no se muestra por seguridad
      rol: usuario.rol
    };
  }

  // Método para actualizar usuario
  actualizarUsuario(): void {

    // Si no hay usuario seleccionado, salir
    if (!this.usuarioEditando) {
      return;
    }

    // Construye el objeto actualizado
    const usuarioActualizado = {
      id: this.usuarioEditando.id,
      nombre: this.nuevoUsuario.nombre,
      password: this.nuevoUsuario.password,
      rol: this.nuevoUsuario.rol
    };

    // Llama al backend
    this.usuarioService.actualizarUsuario(usuarioActualizado.id, usuarioActualizado).subscribe({

      next: () => {

        // Recarga lista
        this.cargarUsuarios();

        // Cancela modo edición
        this.cancelarEdicionUsuario();
      },

      error: (err: any) => {

        console.error('Error al actualizar usuario', err);
      }
    });
  }

  // Método para eliminar usuario
  eliminarUsuario(id: number): void {

    this.usuarioService.eliminarUsuario(id).subscribe({

      next: () => {

        // Recarga lista
        this.cargarUsuarios();
      },

      error: (err: any) => {

        console.error('Error al eliminar usuario', err);
      }
    });
  }

  // Cancela edición
  cancelarEdicionUsuario(): void {

    // Quita el usuario en edición
    this.usuarioEditando = null;

    // Limpia formulario
    this.limpiarFormulario();
  }

  // Limpia los campos del formulario
  limpiarFormulario(): void {

    this.nuevoUsuario = {
      nombre: '',
      password: '',
      rol: ''
    };
  }
}
