import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Producto } from '../../../shared/interfaces/producto.interface';
import { ProductosService } from 'src/app/shared/services/productos.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AlbumLastfm } from 'src/app/shared/interfaces/album-lastfm.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DeseadosService } from 'src/app/shared/services/deseados.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Deseado } from 'src/app/shared/interfaces/deseado.interface';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  styles: []
})
export class SearchPageComponent {

  constructor(
    private productosService: ProductosService,
    private router: Router,
    private authService: AuthService,
    private deseadosService: DeseadosService,
    private snackBar: MatSnackBar
  ) {}

  public searchInput = new FormControl('');
  public productos: AlbumLastfm[] = [];
  public selectedProducto?: Producto;

  public searchProducto() {
    const value: string = (this.searchInput.value || '').trim();
    if (!value) {
      this.productos = [];
      return;
    }

    this.productosService.getAlbumSuggestions(value).subscribe((albums) => {
      this.productos = albums;
    });
  }

  getAlbumImage(album: AlbumLastfm): string {
    return album.image?.find(img => img.size === 'extralarge')?.['#text'] || 'assets/images/assets/placeholder.png';
  }

  public onSelectedOption(event: MatAutocompleteSelectedEvent) {
    if (!event.option.value) {
      this.selectedProducto = undefined;
      return;
    }

    const producto: Producto = event.option.value;
    this.searchInput.setValue(producto.tituloAlbum);
    this.selectedProducto = producto;
  }

  verAlbum(album: AlbumLastfm): void {
    const artist = album.artist; 
    const name = album.name;
    this.router.navigate(['/productos/album', artist, name]);
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
