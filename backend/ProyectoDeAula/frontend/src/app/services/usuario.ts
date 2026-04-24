// Define la estructura de un usuario en Angular
export interface Usuario {

  // id del usuario (opcional)
  // Se genera automáticamente en la base de datos
  id?: number;

  // nombre del usuario (login)
  // Ej: "admin", "empleado1", "12345678" (cliente)
  nombre: string;

  // contraseña del usuario
  // Se usa para autenticación (login)
  password: string;

  // rol del usuario
  // Define permisos dentro del sistema
  // Ej: "administrador", "empleado", "cliente"
  rol: string;

  // id del cliente asociado (opcional)
  // Solo aplica cuando el usuario es tipo "cliente"
  clienteId?: number;
}
