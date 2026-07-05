import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { GestionPedidosComponent } from './gestion-pedidos.component';
import { FormsModule } from '@angular/forms';
import { GestionPedidosRoutingModule } from './gestion-pedidos-routing.module';
import { UpdatePedidoComponent } from './update-pedido/update-pedido.component';
import { CancelarPedidoComponent } from './cancelar-pedido/cancelar-pedido.component';
@NgModule({
  declarations: [GestionPedidosComponent,UpdatePedidoComponent,CancelarPedidoComponent],
  imports: [
    CommonModule,
    GestionPedidosRoutingModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ]
})
export class GestionPedidosModule {}