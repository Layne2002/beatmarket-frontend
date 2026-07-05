import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Pedido } from 'src/app/shared/interfaces/pedido.interface';
import { PedidosService } from 'src/app/shared/services/pedidos.service';
import { UpdatePedidoComponent } from './update-pedido/update-pedido.component';
import { CancelarPedidoComponent } from './cancelar-pedido/cancelar-pedido.component';
import { UsuarioService } from 'src/app/auth/services/usuario.service';
import { Usuario } from 'src/app/shared/interfaces/Usuario.interface';

@Component({
  selector: 'app-gestion-pedidos',
  templateUrl: './gestion-pedidos.component.html',
  styleUrls: ['./gestion-pedidos.component.scss'],
})
export class GestionPedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  searchText: string = '';
  filteredPedidos: Pedido[] = [];

  constructor(
    private pedidosService: PedidosService,
    private dialog: MatDialog,
    private overlay: Overlay,
    private usuariosService: UsuarioService,
  ) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.pedidosService.getTodos().subscribe((data: Pedido[]) => {
      this.pedidos = data;
      this.pedidos.forEach((pedido) => {
        const userId = pedido.usuarioId;
        if (userId) {
          this.usuariosService
            .getUsuario(userId)
            .subscribe((usuario: Usuario) => {
            });
        }
      });
      this.filteredPedidos = this.pedidos;
    });
  }

  filtrarPedidos(): void {
    const filtro = this.searchText.toLowerCase();
    this.filteredPedidos = this.pedidos.filter(pedido =>
      pedido.usuario?.email?.toLowerCase().includes(filtro)
    );
  }

  limpiarFiltro(): void {
    this.searchText = '';
    this.filteredPedidos = this.pedidos;
  }

  editPedido(usuario: Pedido) {
    const dialogRef = this.dialog.open(UpdatePedidoComponent, {
      maxWidth: '90vw',
      height: '90vh',
      maxHeight: '90vh',
      data: usuario,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: 'custom-dialog-scroll',
    });

    dialogRef.afterClosed().subscribe((resp) => {
      if (resp?.ok) {
        this.cargarPedidos();
      }
    });
  }
  confirmarCancelacion(pedido: Pedido) {
    const dialogRef = this.dialog.open(CancelarPedidoComponent, {
      width: '400px',
      data: pedido,
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === 'confirmado') {
        this.cargarPedidos();
      }
    });
  }
}
