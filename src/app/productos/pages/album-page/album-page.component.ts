import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumService } from 'src/app/shared/services/album.service';
import { AlbumLastfm } from 'src/app/shared/interfaces/album-lastfm.interface';
import { DeseadosService} from 'src/app/shared/services/deseados.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductosService } from 'src/app/shared/services/productos.service';
import { Producto } from 'src/app/shared/interfaces/producto.interface';
import { Deseado } from 'src/app/shared/interfaces/deseado.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
@Component({
  selector: 'app-album-page',
  templateUrl: './album-page.component.html',
  styleUrls: ['./album-page.component.scss']
})
export class AlbumPageComponent implements OnInit {
  public album: AlbumLastfm | null = null;
  enStock: boolean = false;
  mongoId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private albumService: AlbumService,
    private deseadosService: DeseadosService,
    private snackBar: MatSnackBar,
    private productosService: ProductosService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const autor = decodeURIComponent(this.route.snapshot.paramMap.get('artist') || '');
    const tituloAlbum = decodeURIComponent(this.route.snapshot.paramMap.get('name') || '');
    if (!autor || !tituloAlbum) return;
    this.albumService.getAlbumInfo(autor, tituloAlbum).subscribe(album => {
      this.album = album;
      this.productosService.buscarPorTituloYAutor(tituloAlbum, autor).subscribe((productos: Producto[]) => {

        const producto = Array.isArray(productos) ? productos[0] : productos;
        if (producto) {
          this.enStock = true;
          this.mongoId = producto.id;
        } else {
          this.enStock = false;
        }
      });
    });
  }
  getAlbumImage(album: AlbumLastfm): string {
    return album?.image?.find(img => img.size === 'extralarge')?.['#text'] || 'assets/images/assets/placeholder.png';
  }

  solicitarAlbum(album: AlbumLastfm): void {
      const usuario = this.authService.currentUser;
      if (!usuario) return;

      this.deseadosService.getDeseadosByUsuario().subscribe((deseados) => {
        const yaExiste = deseados.some(d => 
          d.album === album.name && 
          d.artista === album.artist &&
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
          album: album.name,
          artista: album.artist
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