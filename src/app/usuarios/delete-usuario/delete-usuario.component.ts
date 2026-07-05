import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from 'src/app/shared/interfaces/Usuario.interface';
import { UsuarioService } from 'src/app/auth/services/usuario.service';

@Component({
  selector: 'app-delete-usuario',
  templateUrl: './delete-usuario.component.html',
  styleUrls: ['./delete-usuario.component.scss'],
})
export class DeleteUsuarioComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public usuario: Usuario,
    private servicioUsuario: UsuarioService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  eliminarUsuario() {
    if (!this.usuario?.id) {
      this.snackBar.open('ID de usuario no válido', 'Cerrar', { duration: 5000 });
      return;
    }

    this.servicioUsuario.deleteUsuario(this.usuario.id).subscribe({
      next: () => {
        this.snackBar.open('Usuario eliminado correctamente', 'Cerrar', { duration: 5000 });
        this.dialogRef.close({ ok: true });
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        this.snackBar.open('Error al eliminar el usuario', 'Cerrar', { duration: 5000 });
      }
    });
  }

  onNoClick() {
    this.dialogRef.close({ ok: false });
  }
}
