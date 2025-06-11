import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from 'src/app/shared/interfaces/Usuario.interface';
import { UsuarioService } from 'src/app/auth/services/usuario.service';
import { Role } from 'src/app/shared/interfaces/Role.interface';
import { RolesService } from 'src/app/productos/services/roles.service';

@Component({
  selector: 'app-update-usuario',
  templateUrl: './update-usuario.component.html',
  styleUrls: ['./update-usuario.component.scss'],
})
export class UpdateUsuarioComponent {
  usuarioForm!: FormGroup;
  roles?: Role[];

  constructor(
    public dialogRef: MatDialogRef<UpdateUsuarioComponent>,
    private servicioRoles: RolesService,
    private servicioUsuario: UsuarioService,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public usuario: Usuario
  ) {}

  ngOnInit() {
    this.usuarioForm = new FormGroup({
      id: new FormControl(this.usuario.id, [Validators.required]),
      email: new FormControl(this.usuario.email, [Validators.required, Validators.email]),
      nombre: new FormControl(this.usuario.nombre, [Validators.required]),
      apellidos: new FormControl(this.usuario.apellidos, [Validators.required]),
      contraseña: new FormControl(''),
      rol: new FormControl(this.usuario.rol, [Validators.required])
    });

    this.getRoles();
  }

  getRoles() {
    this.servicioRoles.getAllRoles().subscribe((roles) => {
      this.roles = roles;
    });
  }

  confirmAdd() {
    if (this.usuarioForm.valid) {
      const form = this.usuarioForm.value;
      const usuario = {
        email: form.email,
        nombre: form.nombre,
        apellidos: form.apellidos,
        rol: form.rol,
        ...(form.contraseña && { contraseña: form.contraseña }) 
      };

      this.servicioUsuario.editUsuario(form.id, usuario).subscribe({
        next: (updated) => {
          this.snackBar.open('Usuario actualizado correctamente', 'Cerrar', {
            duration: 5000,
          });
          this.dialogRef.close({ ok: true, data: updated });
        },
        error: () => {
          this.snackBar.open('Error al actualizar el usuario', 'Cerrar', {
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
