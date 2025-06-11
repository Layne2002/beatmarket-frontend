import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Pedido } from 'src/app/shared/interfaces/pedido.interface';
import { PedidosService } from 'src/app/shared/services/pedidos.service';
import { forkJoin } from 'rxjs';
import { ProductosService } from 'src/app/shared/services/productos.service';
import { UsuarioService } from 'src/app/auth/services/usuario.service';

@Component({
  selector: 'app-update-pedido',
  templateUrl: './update-pedido.component.html',
  styleUrls: ['./update-pedido.component.scss'],
})
export class UpdatePedidoComponent {
  pedidoForm!: FormGroup;
  productosCargados: any[] = [];
  emailUsuario: string = '';

  constructor(
    public dialogRef: MatDialogRef<UpdatePedidoComponent>,
    private pedidoService: PedidosService,
    private productoService: ProductosService,
    private usuarioService: UsuarioService,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public pedido: Pedido
  ) {}

  ngOnInit() {
    this.pedidoForm = new FormGroup({
      id: new FormControl({ value: this.pedido.id, disabled: true }),
      emailUsuario: new FormControl({ value: '', disabled: true }),
      total: new FormControl(this.pedido.total, [Validators.required]),
      direccion: new FormGroup({
        calle: new FormControl(this.pedido.direccion?.calle, [Validators.required]),
        ciudad: new FormControl(this.pedido.direccion?.ciudad, [Validators.required]),
        codigoPostal: new FormControl(this.pedido.direccion?.codigoPostal, [Validators.required]),
        pais: new FormControl(this.pedido.direccion?.pais, [Validators.required]),
      }),
      estado: new FormControl(this.pedido?.estado || 'pendiente', [Validators.required]),
      fecha: new FormControl({ value: this.pedido.fecha, disabled: true })
      
    });

    if (this.pedido.usuario?.id) {
      this.usuarioService.getUsuario(this.pedido.usuario.id).subscribe(usuario => {
        this.emailUsuario = usuario.email;
      }, error => {
        console.error('Error al obtener el email del usuario', error);
      });
    }

    if (this.pedido.items?.length) {
      const requests = this.pedido.items.map(item => this.productoService.getProducto(item.id));
      forkJoin(requests).subscribe(productos => {
        this.productosCargados = productos.map((producto, index) => ({
          ...producto,
          cantidad: this.pedido.items[index].cantidad
        }));
      });
    }
  }

  confirmAdd() {
    if (this.pedidoForm.valid) {
      const { usuarioId, ...formValue } = this.pedidoForm.getRawValue();
      const pedido = {
        ...formValue,
        direccion: this.pedidoForm.get('direccion')?.value
      };

      this.pedidoService.editPedido(pedido.id, pedido).subscribe({
        next: (updated) => {
          this.snackBar.open('Pedido actualizado correctamente', 'Cerrar', {
            duration: 5000,
          });
          this.dialogRef.close({ ok: true, data: updated });
        },
        error: () => {
          this.snackBar.open('Error al actualizar el pedido', 'Cerrar', {
            duration: 5000,
          });
        },
      });
    } else {
      this.snackBar.open('El formulario no es válido', 'Cerrar', {
        duration: 5000,
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close({ ok: false });
  }
}
