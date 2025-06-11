import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pago-page',
  templateUrl: './pago-page.component.html',
  styleUrls: ['./pago-page.component.scss']
})
export class PagoPageComponent {
  pagoForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.pagoForm = this.fb.group({
      metodo: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      nombre: ['', Validators.required],
      caducidad: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]]
    });
  }

  continuar() {
    if (this.pagoForm.invalid) return;

    localStorage.setItem('pago', JSON.stringify(this.pagoForm.value));
    this.router.navigate(['/confirmar-pedido']);
  }
}