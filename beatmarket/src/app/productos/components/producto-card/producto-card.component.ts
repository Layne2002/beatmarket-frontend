import { Component, Input, OnInit } from '@angular/core';
import { Producto } from '../../../shared/interfaces/producto.interface';
import { CarritoItem } from 'src/app/shared/interfaces/carritoItem.interface';
import { CarritoService } from 'src/app/shared/services/carrito.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Deseado } from 'src/app/shared/interfaces/deseado.interface';
import { DeseadosService } from 'src/app/shared/services/deseados.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-producto-card',
  templateUrl: './producto-card.component.html',
  styleUrls: ['./producto-card.component.scss'],
})
export class ProductoCardComponent implements OnInit {
  @Input()
  public producto!: Producto;

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService,
    private deseadosService: DeseadosService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (!this.producto) {
      throw new Error('Producto property is required.');
    }
  }
  anyadirAlCarrito(producto: Producto): void {
    if (!this.producto) return;

    const item: CarritoItem = {
      id: this.producto.id,
      tituloAlbum: this.producto.tituloAlbum,
      autor: this.producto.autor,
      precio: this.producto.precio,
      cantidad: 1,
      imagenURL: this.producto.imagenURL,
      stock: this.producto.stock,
    };

    this.carritoService.anyadirItem(item).subscribe(() => {
      this.snackBar.open(
        'Producto añadido al carrito correctamente',
        'Cerrar',
        {
          duration: 3000,
        }
      );
    });
  }
  solicitarAlbum(album: Producto): void {
    const usuario = this.authService.currentUser;
    if (!usuario) return;

    this.deseadosService.getDeseadosByUsuario().subscribe((deseados) => {
      const yaExiste = deseados.some(
        (d) =>
          d.album === album.tituloAlbum &&
          d.artista === album.autor &&
          d.usuarioId === usuario.id
      );

      if (yaExiste) {
        this.snackBar.open(
          'Este álbum ya está en tu lista de deseados',
          'Cerrar',
          {
            duration: 3000,
          }
        );
        return;
      }

      const peticion: Deseado = {
        usuarioId: usuario.id,
        album: album.tituloAlbum,
        artista: album.autor,
      };

      console.log('Enviando petición de álbum:', peticion);

      this.deseadosService.addDeseado(peticion).subscribe(() => {
        console.log('Petición registrada correctamente');
        this.snackBar.open('Álbum añadido a deseados correctamente', 'Cerrar', {
          duration: 3000,
        });
      });
    });
  }
}
