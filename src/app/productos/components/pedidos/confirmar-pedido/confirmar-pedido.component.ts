import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from 'src/app/shared/services/carrito.service';
import { PedidosService } from 'src/app/shared/services/pedidos.service';
import { CarritoItem } from 'src/app/shared/interfaces/carritoItem.interface';
import { Pedido } from 'src/app/shared/interfaces/pedido.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CheckoutService } from 'src/app/shared/services/checkout.service';
import { ProductosService } from 'src/app/shared/services/productos.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-confirmar-pedido',
  templateUrl: './confirmar-pedido.component.html',
  styleUrls: ['./confirmar-pedido.component.scss']
})
export class ConfirmarPedidoComponent implements OnInit {
  carrito: any = [];
  total: number = 0;
  direccion: any;

  constructor(
    private carritoService: CarritoService,
    private pedidosService: PedidosService,
    private router: Router,
    private checkoutService: CheckoutService,
    private productoService: ProductosService,
  ) {}

  ngOnInit(): void {
    const direccion = this.checkoutService.getDireccion();
    this.direccion = direccion;

    this.carritoService.getCarrito().subscribe((data) => {
      const items = data.items;

      const itemRequests = items.map(item =>
        this.productoService.getProducto(item.id).pipe(
          map((producto: any) => ({
            ...producto,
            id: item.id,
            cantidad: item.cantidad
          }))
        )
      );

      forkJoin(itemRequests).subscribe((productosConCantidad) => {
        this.carrito = productosConCantidad;
        this.total = this.carrito.reduce((acc: number, item: any) => acc + item.precio * item.cantidad, 0);
      });
    });
  }

  confirmar(): void {
    const direccion = this.checkoutService.getDireccion();

    const pedido: Pedido = {
      id:null!,
      items: this.carrito,
      total: this.total,
      estado: "Pendiente",
      direccion: direccion
    };

    this.pedidosService.crearPedido(pedido).subscribe(() => {
      const updateRequests = this.carrito.map((item: any) => {
        const productoActualizado = {
          ...item,
          stock: item.stock - item.cantidad
        };
        return this.productoService.actualizarProducto(item.id, productoActualizado);
      });

      forkJoin(updateRequests).subscribe(() => {
        this.carritoService.clearCarrito().subscribe(() => {
          this.router.navigate(['/gracias'], { state: { pedido } });
        });
      });
    });
  }
}