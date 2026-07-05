import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap } from 'rxjs';
import { ProductosService } from 'src/app/shared/services/productos.service';
import { Producto } from '../../../shared/interfaces/producto.interface';
import { CarritoService } from 'src/app/shared/services/carrito.service';
import { CarritoItem } from 'src/app/shared/interfaces/carritoItem.interface';
import { AlbumService } from 'src/app/shared/services/album.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DeseadosService } from 'src/app/shared/services/deseados.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Deseado } from 'src/app/shared/interfaces/deseado.interface';

@Component({
  selector: 'app-producto-page',
  templateUrl: './producto-page.component.html',
  styleUrls: ['./producto-page.component.scss'],
})
export class ProductoPageComponent implements OnInit {
  public producto?: Producto;
  public album?: any;

  constructor(
    private productosService: ProductosService,
    private activatedRoute: ActivatedRoute,
    private albumService: AlbumService,
    private router: Router,
    private authService: AuthService,
    private deseadosService: DeseadosService,
    private snackBar: MatSnackBar,
    private carritoService: CarritoService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        delay(500),
        switchMap(({ id }) => this.productosService.getProducto(id))
      )
      .subscribe((producto) => {
        
        if (!producto) {
          this.router.navigate(['/']);
          return;
        }
        this.producto = producto;

        this.albumService.getAlbumInfo(producto.autor, producto.tituloAlbum).subscribe((albumData) => {
console.log('albumData', albumData);
          this.album = albumData;
          console.log('Álbum de Last.fm cargado:', this.album);
        });

        console.log(producto);
      });
  }

  returnList(): void {
    this.router.navigate(['/']);
  }

  anyadirAlCarrito(): void {
    if (!this.producto) return;

    const item: CarritoItem = {
      id: this.producto.id,
      tituloAlbum: this.producto.tituloAlbum,
      autor: this.producto.autor,
      precio: this.producto.precio,
      cantidad: 1,
      imagenURL: this.producto.imagenURL,
      stock: this.producto.stock
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
        const yaExiste = deseados.some(d => 
          d.album === album.tituloAlbum && 
          d.artista === album.autor &&
          d.usuarioId === usuario.id
        );

        if (yaExiste) {
          this.snackBar.open('Este álbum ya está en tu lista de deseados', 'Cerrar', {
            duration: 3000,
          });
          return;
        }

        const peticion: Deseado = {
          usuarioId: usuario.id,
          album: album.tituloAlbum,
          artista: album.autor
        };

        console.log("Enviando petición de álbum:", peticion);

        this.deseadosService.addDeseado(peticion).subscribe(() => {
          console.log('Petición registrada correctamente');
          this.snackBar.open('Álbum añadido a deseados correctamente', 'Cerrar', {
            duration: 3000,
          });
        });
      });
    }
}
