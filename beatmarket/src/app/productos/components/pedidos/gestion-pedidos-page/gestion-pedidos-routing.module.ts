import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionPedidosComponent } from './gestion-pedidos.component';

const routes: Routes = [
  { path: '', component: GestionPedidosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionPedidosRoutingModule {}