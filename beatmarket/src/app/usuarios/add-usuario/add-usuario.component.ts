import { UsuarioService } from 'src/app/auth/services/usuario.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Role } from 'src/app/shared/interfaces/Role.interface';
import { RolesService } from 'src/app/productos/services/roles.service';

@Component({
  selector: 'app-add-usuario',
  templateUrl: './add-usuario.component.html',
  styleUrls: ['add-usuario.component.scss'],
  standalone: false
})
export class AddUsuarioComponent {
  usuarioForm!: FormGroup;
  roles!: Role[];

  constructor(
    public dialogRef: MatDialogRef<AddUsuarioComponent>,
    private servicioRoles: RolesService,
    private servicioUsuario: UsuarioService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.usuarioForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      nombre: new FormControl(null, [Validators.required]),
      apellidos: new FormControl(null, [Validators.required]),
      contraseña: new FormControl(null, [Validators.required]),
      rol: new FormControl(null, [Validators.required])
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
        contraseña: form.contraseña,
        rol: form.rol
      };

      this.servicioUsuario.addUsuario(usuario).subscribe({
        next: (data) => {
          this.snackBar.open('Usuario creado correctamente', 'Cerrar', {
            duration: 5000,
          });
          this.dialogRef.close({ ok: true, data });
        },
        error: () => {
          this.snackBar.open('Error al crear el usuario', 'Cerrar', {
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
