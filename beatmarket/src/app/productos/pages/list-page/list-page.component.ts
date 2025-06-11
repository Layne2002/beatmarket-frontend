import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../../../shared/interfaces/producto.interface';
import { ProductosService } from 'src/app/shared/services/productos.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['list-page.component.scss'],
})
export class ListPageComponent {
  public allProductos: Producto[] = [];
  public pagedProductos: Producto[] = [];
  public pageSize = 10;
  public pageIndex = 0;
  public pageSizeOptions: number[] = [5, 10, 20];
  public productos$ = new BehaviorSubject<Producto[]>([]);
  public totalProductos: number = 0;
  public filtro: string = '';

  private imageCache: Map<string, string> = new Map();

  constructor(private productosService: ProductosService) {
    this.productosService.getTodosLosProductos().subscribe(productos => {
      this.allProductos = productos.map(producto => ({
        ...producto,
        imagenURL: this.getCachedImageURL(producto)
      }));
      this.totalProductos = productos.length;
      this.updatePagedProductos();
    });
  }

  filtrarProductos() {
    const productosFiltrados = this.allProductos.filter(producto =>
      producto.tituloAlbum.toLowerCase().includes(this.filtro.toLowerCase()) ||
      producto.autor.toLowerCase().includes(this.filtro.toLowerCase())
    );
    this.totalProductos = productosFiltrados.length;
    this.pagedProductos = productosFiltrados.slice(0, this.pageSize);
    this.productos$.next(this.pagedProductos);
  }

  updatePagedProductos() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedProductos = this.allProductos.slice(start, end);
    this.productos$.next(this.pagedProductos);
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePagedProductos();
  }

  private getCachedImageURL(producto: Producto): string {
    if (!producto.imagenURL) return 'assets/images/assets/placeholder.png';
    if (this.imageCache.has(producto.imagenURL)) {
      return this.imageCache.get(producto.imagenURL)!;
    }

    const img = new Image();
    img.src = producto.imagenURL;
    img.onload = () => {
      this.imageCache.set(producto.imagenURL!, producto.imagenURL!);
    };
    img.onerror = () => {
      this.imageCache.set(producto.imagenURL!, 'assets/images/assets/placeholder.png');
    };

    return producto.imagenURL;
  }
}
