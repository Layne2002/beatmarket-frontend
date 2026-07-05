import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { AlbumPageComponent } from './productos/pages/album-page/album-page.component';
import { PerfilPageComponent } from './productos/pages/perfil-page/perfil-page.component';
import { MisPedidosComponent } from './productos/components/pedidos/mis-pedidos/mis-pedidos.component';
import { ConfirmarPedidoComponent } from './productos/components/pedidos/confirmar-pedido/confirmar-pedido.component';
import { PagoPageComponent } from './productos/components/pedidos/pago-page/pago-page.component';
import { DireccionPageComponent } from './productos/components/pedidos/direccion-page/direccion-page.component';
import { LayoutPageComponent } from './productos/pages/layout-page/layout-page.component';
import { GraciasPageComponent } from './productos/components/pedidos/gracias-page/gracias-page.component';
import { adminGuard } from './auth/guards/admin.guard';
import { InicioPageComponent } from './productos/pages/inicio-page/inicio-page.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      {
        path: 'productos',
        loadChildren: () =>
          import('./productos/productos.module').then((m) => m.ProductosModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'perfil',
        component: PerfilPageComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'mis-pedidos',
        component: MisPedidosComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'album/:artist/:name',
        component: AlbumPageComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'usuarios',
        canActivate: [adminGuard],
        loadChildren: () =>
          import('./usuarios/usuarios-page.module').then(
            (m) => m.UsuariosPageModule
          ),
      },
      {
        path: 'direccion',
        component: DireccionPageComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'confirmar-pedido',
        component: ConfirmarPedidoComponent,
        canActivate: [AuthGuard],
      },
      { path: 'pago', component: PagoPageComponent, canActivate: [AuthGuard] },
      {
        path: 'gracias',
        component: GraciasPageComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'inicio',
        component: InicioPageComponent,
        canActivate: [AuthGuard],
      },
    ],
  },

  { path: '404', component: Error404PageComponent },

  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
