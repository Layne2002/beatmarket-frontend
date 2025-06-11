import { Component, OnInit } from '@angular/core';
import { PedidosService } from 'src/app/shared/services/pedidos.service';
import { Pedido } from 'src/app/shared/interfaces/pedido.interface';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-mis-pedidos',
  templateUrl: './mis-pedidos.component.html',
  styleUrls: ['./mis-pedidos.component.scss']
})
export class MisPedidosComponent implements OnInit {
  pedidos: Pedido[] = [];

  constructor(private pedidoService: PedidosService, private cookie: CookieService) {}

  ngOnInit(): void {
    this.pedidoService.getPedidosByUsuario().subscribe(pedidos => {
      this.pedidos = pedidos;
      console.log('Pedidos cargados:', this.pedidos[0]);
    });
  }
}