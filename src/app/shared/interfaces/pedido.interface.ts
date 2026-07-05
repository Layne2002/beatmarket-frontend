import { CarritoItem } from "./carritoItem.interface";
import { Usuario } from "./Usuario.interface";

export interface Direccion {
  calle: string;
  ciudad: string;
  codigoPostal: string;
  pais: string;
  nombre: string;
  apellidos: string;
}
export interface Pedido {
  id: string;
  usuarioId?: string;
  usuario?:Usuario;
  items: CarritoItem[];
  total: number;
  estado: string; 
  direccion: Direccion;
  fecha?: string; 
}