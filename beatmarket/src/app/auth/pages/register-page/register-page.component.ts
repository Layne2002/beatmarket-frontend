import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from '../../../shared/interfaces/Usuario.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class registerUserComponent {
  public userForm = new FormGroup({
    nombre: new FormControl<string>('', { nonNullable: true }),
    apellidos: new FormControl<string>('', { nonNullable: true }),
    email: new FormControl<string>('', { nonNullable: true }),
    contraseña: new FormControl<string>('', { nonNullable: true }),
  });

  public currentUser: Usuario = null!;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  onLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }
    const usuario: Usuario = this.userForm.value as Usuario;
    this.authService.register(usuario).subscribe({
      next: () => {
        this.showSnackBar(`${usuario.email} creado con éxito`);
        this.userForm.reset();
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        this.snackBar.open('Error al registrar el usuario', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'ok', {
      duration: 2500,
    });
  }
}
