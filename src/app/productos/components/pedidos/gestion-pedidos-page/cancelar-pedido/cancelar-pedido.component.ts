import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PedidosService } from 'src/app/shared/services/pedidos.service';
import { Pedido } from 'src/app/shared/interfaces/pedido.interface';

@Component({
  selector: 'app-cancelar-pedido',
  templateUrl: './cancelar-pedido.component.html',
  styleUrls: ['./cancelar-pedido.component.scss'],
})
export class CancelarPedidoComponent {
  constructor(
    public dialogRef: MatDialogRef<CancelarPedidoComponent>,
    @Inject(MAT_DIALOG_DATA) public pedido: Pedido,
    private pedidoService: PedidosService,
    private snackBar: MatSnackBar
  ) {}

  confirmarCancelacion() {
    if (!this.pedido?.id) {
      this.snackBar.open('ID de pedido no válido', 'Cerrar', { duration: 5000 });
      return;
    }

    this.pedidoService.cancelarPedido(this.pedido.id).subscribe({
      next: () => {
        this.snackBar.open('Pedido cancelado correctamente', 'Cerrar', { duration: 5000 });
        this.dialogRef.close('confirmado');
      },
      error: (err) => {
        console.error('Error al cancelar:', err);
        this.snackBar.open('Error al cancelar el pedido', 'Cerrar', { duration: 5000 });
      }
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
