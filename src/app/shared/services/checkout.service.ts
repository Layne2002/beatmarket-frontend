import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private direccion: any = null;

  setDireccion(direccion: any) {
    this.direccion = direccion;
    localStorage.setItem('direccion', JSON.stringify(direccion));
    
  }

  getDireccion(): any {
    if (this.direccion) return this.direccion;
    const data = localStorage.getItem('direccion');
    if (data) {
      this.direccion = JSON.parse(data);
      return this.direccion;
    }
    return null;
  }

}