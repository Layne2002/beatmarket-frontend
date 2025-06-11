import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { ProductoPageComponent } from './pages/producto-page/producto-page.component';
import { AlbumPageComponent } from './pages/album-page/album-page.component';
import { DeseadosPageComponent } from './pages/deseados-page/deseados-page.component';
import { CarritoPageComponent } from './components/pedidos/carrito-page/carrito-page.component';
import { GestionStockPageComponent } from './pages/gestion-stock-page/gestion-stock-page.component';
import { InicioPageComponent } from './pages/inicio-page/inicio-page.component';
import { adminGuard } from '../auth/guards/admin.guard';


const routes: Routes = [
  { path: 'album/:artist/:name', component: AlbumPageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'list', component: ListPageComponent },
  { path: 'carrito', component: CarritoPageComponent },
  {
    path: 'gestion-pedidos',
    canActivate:[adminGuard],
    loadChildren: () =>
      import('./components/pedidos/gestion-pedidos-page/gestion-pedidos.module').then(
        (m) => m.GestionPedidosModule
      ),
  },
  { path: 'stock',canActivate:[adminGuard], component: GestionStockPageComponent },
  { path: 'deseados', component: DeseadosPageComponent },
  { path: ':id', component: ProductoPageComponent },
  { path: '**', component: InicioPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductosRoutingModule {}
