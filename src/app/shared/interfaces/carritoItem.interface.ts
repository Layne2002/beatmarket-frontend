export interface CarritoItem {
    id: string;
    tituloAlbum: string;
    autor: string;
    precio: number;
    cantidad: number;
    imagenURL?: string;
    stock: number;
  }

export interface Carrito {
  id?: string;
  usuarioId: string;
  items: CarritoItem[];
}