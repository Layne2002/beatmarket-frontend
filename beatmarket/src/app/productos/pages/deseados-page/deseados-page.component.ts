import { ProductosService } from 'src/app/shared/services/productos.service';
import { Producto } from 'src/app/shared/interfaces/producto.interface';
import { Component, OnInit } from '@angular/core';
import { DeseadosService } from 'src/app/shared/services/deseados.service';
import { Deseado } from 'src/app/shared/interfaces/deseado.interface';
import { Router } from '@angular/router';
@Component({
  selector: 'app-deseados-page',
  templateUrl: './deseados-page.component.html',
  styleUrls: ['./deseados-page.component.scss'],
})
export class DeseadosPageComponent implements OnInit {
  deseados: Deseado[] = [];
  deseadosDisponibles: Deseado[] = [];

  constructor(
    private deseadosService: DeseadosService,
    private router: Router,
    private productosService: ProductosService
  ) {}

  ngOnInit(): void {
    this.deseadosService.getDeseadosByUsuario().subscribe((res) => {
      console.log('Deseados cargados:', res);
      this.deseados = res.filter((d) => !d.disponible);
      this.deseadosDisponibles = res.filter((d) => d.disponible);
    });
  }
  encode(text: string): string {
    return encodeURIComponent(text);
  }
  eliminarDeseado(id: string): void {
    console.log('Eliminando deseado con ID:', id);
    this.deseadosService.deleteDeseado(id).subscribe(() => {
      this.deseados = this.deseados.filter((d) => d.id !== id);
      this.deseadosDisponibles = this.deseadosDisponibles.filter(
        (d) => d.id !== id
      );
      console.log('Deseado eliminado correctamente');
    });
  }
  verProducto(tituloAlbum: string, autor: string): void {
    this.productosService.getProductoPorTituloYAutor(tituloAlbum, autor).subscribe((producto) => {
      console.log('Producto recibido del servicio:', producto);
      if (producto && producto.id) {
        this.router.navigate(['/productos', producto.id]);
      } else {
        console.warn('Producto no encontrado para redirección.');
      }
    });
  }
}
