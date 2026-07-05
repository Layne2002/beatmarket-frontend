import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pedido } from 'src/app/shared/interfaces/pedido.interface';

@Component({
  selector: 'app-gracias-page',
  templateUrl: './gracias-page.component.html',
  styleUrls: ['./gracias-page.component.scss']
})
export class GraciasPageComponent implements OnInit {
  pedido!: Pedido;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { pedido: Pedido };
    if (state && state.pedido) {
      this.pedido = state.pedido;
    }
  }

  ngOnInit(): void {
    localStorage.removeItem('carrito'); 
    localStorage.removeItem('direccion');
    localStorage.removeItem('pago');
  }
}