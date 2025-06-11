import { Pipe, PipeTransform } from '@angular/core';
import { Producto } from 'src/app/shared/interfaces/producto.interface';
import { AlbumService } from 'src/app/shared/services/album.service';

@Pipe({
  name: 'ProductoImagePipe',
  pure: false
})
export class ProductoImagePipe implements PipeTransform {
  private cache: { [key: string]: string } = {};

  constructor(private albumService: AlbumService) {}

  transform(data: Producto | { name: string; artist: string }): string {
    let autor: string;
    let titulo: string;

    if ('autor' in data && 'tituloAlbum' in data) {
      autor = data.autor;
      titulo = data.tituloAlbum;
    } else if ('artist' in data && 'name' in data) {
      autor = data.artist;
      titulo = data.name;
    } else {
      return 'assets/images/assets/placeholder.png';
    }

    const key = `${autor}_${titulo}`;
    if (this.cache[key]) {
      return this.cache[key];
    } else {
      this.albumService.getAlbumImage(autor, titulo).subscribe((url) => {
        this.cache[key] = url || 'assets/images/assets/placeholder.png';
      });
      return 'assets/images/assets/placeholder.png';
    }
  }
}