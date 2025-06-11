import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductosRoutingModule } from './productos-routing.module';
import { ProductoPageComponent } from './pages/producto-page/producto-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { MaterialModule } from '../material/material.module';
import { ProductoCardComponent } from './components/producto-card/producto-card.component';
import { ProductoImagePipe } from './pipes/image.pipe';
import { AlbumPageComponent } from './pages/album-page/album-page.component';
import { DeseadosPageComponent } from './pages/deseados-page/deseados-page.component';
import { CarritoPageComponent } from './components/pedidos/carrito-page/carrito-page.component';
import { ConfirmarPedidoComponent } from './components/pedidos/confirmar-pedido/confirmar-pedido.component';
import { DireccionPageComponent } from './components/pedidos/direccion-page/direccion-page.component';
import { PagoPageComponent } from './components/pedidos/pago-page/pago-page.component';
import { GestionStockPageComponent } from './pages/gestion-stock-page/gestion-stock-page.component';
import { PerfilPageComponent } from './pages/perfil-page/perfil-page.component';
import { MisPedidosComponent } from './components/pedidos/mis-pedidos/mis-pedidos.component';
import { GraciasPageComponent } from './components/pedidos/gracias-page/gracias-page.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
@NgModule({
  declarations: [
    ProductoPageComponent,
    AlbumPageComponent,
    LayoutPageComponent,
    ListPageComponent,
    SearchPageComponent,
    ProductoCardComponent,
    ProductoImagePipe,
    ConfirmDialogComponent,
    DeseadosPageComponent,
    CarritoPageComponent,
    ConfirmarPedidoComponent,
    DireccionPageComponent,
    PagoPageComponent,
    GestionStockPageComponent,
    PerfilPageComponent,
    MisPedidosComponent,
    GraciasPageComponent
    
  ],
  imports: [
    MaterialModule,
    ProductosRoutingModule,
  ],
})
export class ProductosModule {}
