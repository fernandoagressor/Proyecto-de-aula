// Define la estructura de un objeto Cliente en Angular
export interface Cliente {

  // id del cliente (opcional)
  // Es opcional porque cuando se crea el cliente, aún no tiene id
  // El id lo genera la base de datos (MySQL)
  id?: number;

  // Nombre del cliente
  nombre: string;

  // Número de cédula del cliente
  cedula: string;

  // Teléfono del cliente
  telefono: string;

  // Dirección del cliente
  direccion: string;
}
