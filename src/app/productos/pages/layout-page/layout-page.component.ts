import { Component, Renderer2 } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Usuario } from '../../../shared/interfaces/Usuario.interface';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Roles } from '../../../shared/interfaces/Role.interface';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.scss'],
})
export class LayoutPageComponent {

public userSidebarItems = [
  { label: 'Catálogo', icon: 'label', url: '/productos/list' },
  { label: 'Fuera de stock', icon: 'search', url: '/productos/search' },
  { label: 'Mis Deseados', icon: 'favorite', url: '/productos/deseados' },
  { label: 'Mis Pedidos', icon: 'assignment_turned_in', url: '/mis-pedidos' },
  { label: 'Carrito', icon: 'shopping_cart', url: '/productos/carrito' },
];

public adminItems = [
  { label: 'Usuarios', icon: 'person', url: '/usuarios' },
  { label: 'Gestión de stock', icon: 'inventory', url: '/productos/stock' },
  { label: 'Pedidos', icon: 'assignment', url: '/productos/gestion-pedidos' },
];

  constructor(
    public authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
  ) {}

  get user(): Usuario | null {
    return this.authService.currentUser;
  }

  get isAdmin(): boolean {
    return this.user?.rol === Roles.Admin;
  }
  onSidebarItemClick(label: string) {
    console.log('Sidebar item clicked:', label);
  }
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
