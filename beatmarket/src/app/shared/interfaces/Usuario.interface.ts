export interface Usuario {
  id?: string; // MongoDB lo devuelve como id (no _id)
  nombre: string;
  apellidos: string;
  email: string;
  contraseña: string;
  rol: number; // 0 = Usuario, 1 = Admin
}