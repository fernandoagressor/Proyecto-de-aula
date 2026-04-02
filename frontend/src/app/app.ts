import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService, Usuario } from './usuarios';
import { ClienteService, Cliente } from './clientes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  usuarios: Usuario[] = [];
  clientes: Cliente[] = [];

  nombre: string = '';
  password: string = '';
  rol: string = '';

  loginNombre: string = '';
  loginPassword: string = '';


  usuarioSeleccionado: Usuario | null = null;
  usuarioLogueado: Usuario | null = null;

  clienteNombre: string = '';
  clienteCedula: string = '';
  clienteTelefono: string = '';
  clienteDireccion: string = '';

  clienteSeleccionado: Cliente | null = null;
  constructor(private usuariosService: UsuariosService, private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.recuperarSesion();
    this.cargarUsuarios();
    this.cargarClientes();
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
  cargarClientes(): void {
    this.clienteService.obtenerClientes().subscribe({
      next: (data: Cliente[]) => {
        this.clientes = data;
      },
      error: (err: unknown) => {
        console.error('Error al cargar clientes', err);
      }
    })
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
    return this.usuarioLogueado?.rol === 'administrador';
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
      next: () => {
        this.nombre = '';
        this.password = '';
        this.rol = '';
        this.cargarUsuarios();
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
   crearCliente(): void {
    if (!this.esAdmin()) {
      alert('solo el administrador puede editar cliente');
      return;
    }
    if (!this.clienteNombre ||!this.clienteCedula || !this.clienteTelefono || !this.clienteDireccion) {
      alert("Todos los campos del cliente son obligatorios");
      return;
    }
    const nuevoCliente: Cliente = {
      id: 0,
      nombre: this.clienteNombre,
      cedula: this.clienteCedula,
      telefono: this.clienteTelefono,
      direccion: this.clienteDireccion
    };
    this.clienteService.crearCliente(nuevoCliente).subscribe({
      next: () => {
        this.clienteNombre = '';
        this.clienteCedula = '';
        this.clienteTelefono = '';
        this.clienteDireccion = '';
        this.cargarClientes();
      },
      error: (err: unknown) => {
        console.error('Error al crear cliente', err);
      }
    });
   }
   eliminarCliente(id: number): void {
    if (!this.esAdmin()) {
      alert("solo el administrador puede eliminar clientes");
      return;
    }
    const confirmar = confirm("¿Seguro que quieres eliminar este cliente?");
    if (!confirmar) {
      return;
    }
    this.clienteService.eliminarCliente(id).subscribe({
      next: () => {
        this.cargarClientes();
      },
      error: (err: unknown) => {
        console.error('Error al eliminar eliminar cliente', err);
      }
    });
   }
   seleccionarCliente(cliente: Cliente): void {
    if (!this.esAdmin()) {
      alert("Solo el administrador puede editar clientes");
      return;
    }
    this.clienteSeleccionado = { ...cliente };
   }
   actualizarCliente(): void {
    if (!this.esAdmin()) {
      alert("Solo el administrador puede actualizar clientes");
      return;
    }
    if (!this.clienteSeleccionado) {
      return;
    }
    if (!this.clienteSeleccionado.nombre || !this.clienteSeleccionado.cedula ||
      !this.clienteSeleccionado.telefono || !this.clienteSeleccionado.direccion) {
      alert("Todos los campos del cliente a editar son obligatorios");
      return;
    }
    this.clienteService.actualizarCliente(this.clienteSeleccionado.id, this.clienteSeleccionado).subscribe({
      next: () => {
        this.clienteSeleccionado = null;
        this.cargarClientes();
      },
      error: (err: unknown) => {
        console.error('Error al actualizar cliente', err);
      }
    });

   }
   cancelarEdicionCliente(): void {
    this.clienteSeleccionado = null;
   }
}


