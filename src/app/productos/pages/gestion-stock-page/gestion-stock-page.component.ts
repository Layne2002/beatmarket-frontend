import { Component, OnInit } from '@angular/core';
import { DeseadosService } from 'src/app/shared/services/deseados.service';
import { ProductosService } from 'src/app/shared/services/productos.service';
import { AlbumService } from 'src/app/shared/services/album.service';
import { Deseado } from 'src/app/shared/interfaces/deseado.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NuevoProducto } from 'src/app/shared/interfaces/NuevoProducto.interface';

@Component({
  selector: 'app-gestion-stock-page',
  templateUrl: './gestion-stock-page.component.html',
  styleUrls: ['./gestion-stock-page.component.scss']
})
export class GestionStockPageComponent implements OnInit {
  deseados: Deseado[] = [];
  columnas: string[] = ['album', 'artista', 'acciones'];
  productosBajoStock: NuevoProducto[] = [];

  constructor(
    private deseadoService: DeseadosService,
    private productoService: ProductosService,
    private albumService: AlbumService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.deseadoService.getDeseados().subscribe((data) => {
      this.deseados = data.filter(d => !d.disponible);
    });
    this.productoService.getTodosLosProductos().subscribe((productos) => {
      this.productosBajoStock = productos.filter(p => p.stock <= 10);
    });
  }

  anyadirAlCatalogo(deseado: Deseado) {
    this.albumService.getAlbumInfo(deseado.artista, deseado.album).subscribe((album) => {
      const tags = album?.tags?.tag || [];

      const nuevo: NuevoProducto = {
        tituloAlbum: deseado.album,
        autor: deseado.artista,
        precio: 15.99,
        imagenURL: album?.image?.find((i: any) => i.size === 'extralarge')?.['#text'] || '',
        stock: 50
      };

      this.productoService.crearProducto(nuevo).subscribe({
        next: () => {
          this.snackBar.open('Producto añadido al catálogo', 'Cerrar', { duration: 3000 });
          this.deseadoService.updateDeseado({ ...deseado, disponible: true }).subscribe(() => {
              this.deseados = this.deseados.filter(d => d.id !== deseado.id);
            });
        },
        error: (err) => {
          console.error('Error al añadir producto:', err);
        }
      });
    });
  }

  restockDeseados() {
    this.deseados.forEach(deseado => {
      this.albumService.getAlbumInfo(deseado.artista, deseado.album).subscribe((album) => {
        const tags = album?.tags?.tag || [];

        const nuevo: NuevoProducto = {
          tituloAlbum: deseado.album,
          autor: deseado.artista,
          precio: 15.99,
          imagenURL: album?.image?.find((i: any) => i.size === 'extralarge')?.['#text'] || '',
          stock: 50
        };

        this.productoService.crearProducto(nuevo).subscribe({
          next: () => {
            this.snackBar.open(`${deseado.album} añadido al catálogo`, 'Cerrar', { duration: 3000 });
            this.deseadoService.updateDeseado({ ...deseado, disponible: true }).subscribe(() => {
              this.deseados = this.deseados.filter(d => d.id !== deseado.id);
            });
          },
          error: (err) => {
            console.error(`Error al añadir ${deseado.album}:`, err);
          }
        });
      });
    });
  }

  restockTopAlbums() {
    console.log('Botón restockTopAlbums pulsado');
    this.albumService.getTrendingArtists(50).subscribe({
      next: (artists) => {
        const topArtists = artists.slice(0, 50); 
        console.log('Artistas recibidos:', artists);
        topArtists.forEach((artist: any) => {
          this.albumService.getTopAlbumsByArtist(artist).subscribe({
            
            next: (albumData) => {
              console.log(`Respuesta de la API para ${artist}:`, albumData);
              const topAlbums = Array.isArray(albumData) ? albumData : albumData?.topalbums?.album?.slice(0, 3);
              if (!topAlbums) return;

              topAlbums.forEach((topAlbum: any) => {
                const nuevo: NuevoProducto = {
                  tituloAlbum: topAlbum.name,
                  autor: topAlbum.artist?.name || artist,
                  precio: 15.99,
                  imagenURL: topAlbum.image?.find((i: any) => i.size === 'extralarge')?.['#text'] || '',
                  stock: 50
                };
                console.log('Nuevo producto:', nuevo);
                this.productoService.crearOActualizarProducto(nuevo).subscribe({
                  next: () => {
                    this.snackBar.open(`${topAlbum.name} de ${artist} añadido`, 'Cerrar', { duration: 3000 });
                  },
                  error: (err) => {
                    console.error(`Error al añadir ${topAlbum.name}:`, err);
                  }
                });
              });
            },
            error: (err) => {
              console.error(`Error obteniendo top álbumes de ${artist.name}:`, err);
            }
          });
        });
      },
      error: (err) => {
        console.error('Error obteniendo artistas populares:', err);
      }
    });
  }


  aumentarStock50(producto: NuevoProducto) {
    const actualizado = { ...producto, stock: 50 };
    this.productoService.crearOActualizarProducto(actualizado).subscribe({
      next: () => {
        this.snackBar.open(`${producto.tituloAlbum} actualizado a 50 unidades`, 'Cerrar', { duration: 3000 });
        this.productoService.getTodosLosProductos().subscribe((productos) => {
          this.productosBajoStock = productos.filter(p => p.stock < 5);
        });
      },
      error: (err) => {
        console.error(`Error al actualizar ${producto.tituloAlbum}:`, err);
      }
    });
  }

  aumentarStockTodos() {
    const actualizaciones = this.productosBajoStock.map(producto => {
      const actualizado = { ...producto, stock: 50 };
      return this.productoService.crearOActualizarProducto(actualizado);
    });

    if (actualizaciones.length > 0) {
      Promise.all(actualizaciones.map(obs => obs.toPromise()))
        .then(() => {
          this.snackBar.open('Todos los productos actualizados a 50 unidades', 'Cerrar', { duration: 3000 });
          this.productoService.getTodosLosProductos().subscribe((productos) => {
            this.productosBajoStock = productos.filter(p => p.stock < 5);
          });
        })
        .catch((error) => {
          console.error('Error al actualizar todos los productos:', error);
        });
    }
  }
}