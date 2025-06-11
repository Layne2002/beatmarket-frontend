import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/auth/services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from 'src/app/shared/interfaces/Usuario.interface';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-perfil-page',
  templateUrl: './perfil-page.component.html',
  styleUrls: ['./perfil-page.component.scss']
})
export class PerfilPageComponent implements OnInit {

  userForm!: FormGroup;
  usuario!: Usuario;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar,
    private authService: AuthService, 
  ) {}

ngOnInit(): void {
  const usuario = this.authService.currentUser;
  if (usuario) {
    this.usuario = usuario;
    this.userForm = this.fb.group({
      nombre: [usuario.nombre, Validators.required],
      apellidos: [usuario.apellidos, Validators.required],
      email: [usuario.email, [Validators.required, Validators.email]],
      contraseña: [''],
    });
  } else {
    console.error('No se encontró usuario autenticado.');
    this.snackBar.open('No se pudo cargar el usuario. Inicia sesión nuevamente.', 'Cerrar', { duration: 5000 });
  }
}

  guardarCambios() {
    const usuarioActualizado: Usuario = {
      ...this.usuario,
      ...this.userForm.value
    };
    this.usuarioService.editUsuario(this.usuario.id!, usuarioActualizado).subscribe({
      next: () => {
        this.snackBar.open('Perfil actualizado correctamente', 'Cerrar', { duration: 3000 });
        this.authService.logout(); 
      },
      error: () => {
        this.snackBar.open('Error al actualizar el perfil', 'Cerrar', { duration: 3000 });
      }
    });

  }
}