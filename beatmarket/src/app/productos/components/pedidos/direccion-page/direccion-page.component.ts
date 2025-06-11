import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutService } from 'src/app/shared/services/checkout.service';

@Component({
  selector: 'app-direccion-page',
  templateUrl: './direccion-page.component.html',
  styleUrls: ['./direccion-page.component.scss']
})
export class DireccionPageComponent {
  direccionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private checkoutService: CheckoutService
  ) {
    this.direccionForm = this.fb.group({
      nombre: ['', Validators.required],
      calle: ['', Validators.required],
      ciudad: ['', Validators.required],
      codigoPostal: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      pais: ['', Validators.required]
    });
  }

  continuar() {
    if (this.direccionForm.invalid) return;
  console.log('Formulario de dirección enviado:', this.direccionForm.value);
    const direccion = this.direccionForm.value;


    this.checkoutService.setDireccion(direccion);

    this.router.navigate(['/pago']);
  }
}