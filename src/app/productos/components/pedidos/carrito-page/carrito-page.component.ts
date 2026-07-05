import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CarritoService } from 'src/app/shared/services/carrito.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProductosService } from 'src/app/shared/services/productos.service';
import { CarritoItem } from 'src/app/shared/interfaces/carritoItem.interface';
import { forkJoin, map } from 'rxjs';


interface Carrito {
  items: CarritoItem[];
}

@Component({
  selector: 'app-carrito-page',
  templateUrl: './carrito-page.component.html',
  styleUrls: ['./carrito-page.component.scss']
})
export class CarritoPageComponent implements OnInit {
  carrito: Carrito | null = null;

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService,
    private productoService: ProductosService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarCarrito();
  }

  private cargarCarrito(): void {
      this.carritoService.getCarrito().subscribe((data) => {
        const items = data.items || [];
        const itemRequests = items.map(item =>
          this.productoService.getProducto(item.id).pipe(
            map((producto: any) => ({
              ...producto,
              id: item.id,
              cantidad: item.cantidad
            }))
          )
        );

        forkJoin(itemRequests).subscribe(productosConCantidad => {
          this.carrito = {
            items: productosConCantidad
          };
        });
      });
    
  }

  eliminarItem(id: string): void {
    this.carritoService.quitarItem(id).subscribe(() => {
      this.cargarCarrito();
    });
  }

  cambiarCantidad(item: CarritoItem): void {
    item.cantidad = Math.max(1, item.cantidad);
    this.carritoService.actualizarCantidad(item.id, item.cantidad).subscribe(() => {
      if (this.carrito) {
        if (item.cantidad > item.stock) {
      item.cantidad = item.stock;
      this.snackBar.open('No puedes añadir más unidades que el stock disponible.', 'Cerrar', {
        duration: 3000,
      });
      return;
    }
        const index = this.carrito.items.findIndex(i => i.id === item.id);
        if (index !== -1) {
          this.carrito.items[index].cantidad = item.cantidad;
        }
      }
    });
  }

  get total(): number {
    return (this.carrito?.items || []).reduce((acc: number, item: CarritoItem) => acc + item.precio * item.cantidad, 0);
  }

  vaciarCarrito(): void {
    this.carritoService.clearCarrito().subscribe(() => {
      this.carrito = { items: [] };
    });
  }
}