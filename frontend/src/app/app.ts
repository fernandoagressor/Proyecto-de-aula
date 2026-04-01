import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService, Usuario } from './usuarios';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  usuarios: Usuario[] = [];

  nombre: string = '';
  password: string = '';
  rol: string = '';

  loginNombre: string = '';
  loginPassword: string = '';


  usuarioSeleccionado: Usuario | null = null;
  usuarioLogueado: Usuario | null = null;

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.recuperarSesion();
    this.cargarUsuarios();
  }
  recuperarSesion(): void {
    const usarioGuardado = localStorage.getItem('usuarioLogueado');
    if (usarioGuardado) {
      this.usuarioLogueado = JSON.parse(usarioGuardado);
    }
  }

  cargarUsuarios(): void {
    this.usuariosService.obtenerUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
      },
      error: (err: unknown) => {
        console.error('Error al cargar usuarios', err);
      },
    });
  }



  login(): void {
    const datosLogin = {
      nombre: this.loginNombre, password: this.loginPassword
  };
    console.log('Enviando Login', datosLogin);

    this.usuariosService.login(datosLogin).subscribe({
      next: (respuesta ): void => {
        console.log('Respuesta Login: ', respuesta);
        if (respuesta) {
          this.usuarioLogueado = respuesta;
          localStorage.setItem('usuarioLogueado', JSON.stringify(respuesta));
          this.loginNombre='';
          this.loginPassword='';
          alert('login correcto')
        }else{
          alert("Usuario o contraseña incorrectos");
        }
      },
      error: (err: unknown):void => {
        console.error('Error en login', err);
        alert("Error al iniciaar sesion");
      }
    });
  }
  logout(): void {
    this.usuarioLogueado = null;
    this.usuarioSeleccionado = null;
    localStorage.removeItem('usuarioLogueado');
  }
  esAdmin(): boolean{
    return this.usuarioLogueado?.rol === 'adminastrador';
  }
  esEmpleado(): boolean{
    return this.usuarioLogueado?.rol === 'empleado';
  }
  crearUsuario():void{
    if(!this.esAdmin()){
      alert('Solo el administrador purde crear usuarios');
      return;
    }

    if (!this.nombre || !this.password || !this.rol) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const nuevoUsuario: Usuario = {
      id: 0,
      nombre: this.nombre,
      password: this.password,
      rol: this.rol,
    };

    this.usuariosService.crearUsuario(nuevoUsuario).subscribe({
      next: (usuarioCreado: Usuario) => {
        this.usuarios.push(usuarioCreado);

        this.nombre = '';
        this.password = '';
        this.rol = '';
      },
      error: (err: unknown) => {
        console.error('Error al crear usuario', err);
      },
    });
  }

  eliminarUsuario(id: number): void {
    if (!this.esAdmin()) {
      alert('solo el administrador puede eliminar usuarios');
      return;
    }
    const confirmar = confirm("¿Seguro que quieres eliminar este usuario?");
    if (!confirmar) {
      return;
    }
    this.usuariosService.eliminarUsuario(id).subscribe({
      next: ():void => {
        this.cargarUsuarios();
      },
      error: (err: unknown):void => {
        console.error('Error al eliminar usuario', err);
      },
    });
  }


  seleccionarUsuario(usuario: Usuario):void {
    if (!this.esAdmin()){
      alert("solo el administrador puede editar usuarios");
      return;
    }
    this.usuarioSeleccionado = { ...usuario };
  }

  actualizarUsuario():void {
    if(!this.esAdmin()){
      alert('solo el administrador puede actualizar usuarios');
      return;
    }
    if (!this.usuarioSeleccionado){
      return;
    }
    if (!this.usuarioSeleccionado.nombre || !this.usuarioSeleccionado.password || !this.usuarioSeleccionado.rol){
      alert("Todos los campos del usuario a editar son obligatorios");
      return;
    }
    this.usuariosService.actualizarUsuario(this.usuarioSeleccionado.id, this.usuarioSeleccionado)
      .subscribe({
        next: () => {
          this.usuarioSeleccionado = null;
          this.cargarUsuarios()
        },
        error:(err: unknown) => {
          console.error('Error al actualizar usuario', err);
        }
      });
   }
    cancelarEdicion(): void {
    this.usuarioSeleccionado = null;
   }
}


