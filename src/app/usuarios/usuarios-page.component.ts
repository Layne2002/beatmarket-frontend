import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Overlay } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';

import { Usuario } from 'src/app/shared/interfaces/Usuario.interface';
import { UsuarioService } from 'src/app/auth/services/usuario.service';
import { AddUsuarioComponent } from './add-usuario/add-usuario.component';
import { DeleteUsuarioComponent } from './delete-usuario/delete-usuario.component';
import { UpdateUsuarioComponent } from './update-usuario/update-usuario.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Roles } from 'src/app/shared/interfaces/Role.interface';

@Component({
  selector: 'app-usuarios-page',
  templateUrl: './usuarios-page.component.html',
  styleUrls: ['./usuarios-page.component.scss'],
})
export class UsuariosPageComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchText: string = '';
  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();
  filterValue: string = '';

  displayedColumns: string[] = [
    'id',
    'email',
    'nombre_completo',
    'rol',
    'acciones',
  ];

  constructor(
    private dialog: MatDialog,
    private userService: UsuarioService,
    private overlay: Overlay,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.currentUser?.rol !== Roles.Admin) {
      this.router.navigate(['/404']);
    }
    this.dataSource.filterPredicate = (data: Usuario, filter: string) =>
      data.email.toLowerCase().includes(filter.trim().toLowerCase());
    this.getUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  
  getUsuarios() {
    this.userService.getAllUsuarios().subscribe((usuarios) => {
      this.dataSource.data = usuarios;
    });
  }

  addUsuario() {
    const dialogRef = this.dialog.open(AddUsuarioComponent, {
        maxWidth: '90vw',
        height: '90vh',
        maxHeight: '90vh',
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      panelClass: 'custom-dialog-scroll',
    });

    dialogRef.afterClosed().subscribe((resp) => {
      if (resp?.ok) {
        this.getUsuarios();
      }
    });
  }

  editUsuario(usuario: Usuario) {
    const dialogRef = this.dialog.open(UpdateUsuarioComponent, {
        maxWidth: '90vw',
        height: '90vh',
        maxHeight: '90vh',
      data: usuario,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      panelClass: 'custom-dialog-scroll',
    });

    dialogRef.afterClosed().subscribe((resp) => {
      if (resp?.ok) {
        this.getUsuarios();
      }
    });
  }

  deleteUsuario(usuario: Usuario) {
    const dialogRef = this.dialog.open(DeleteUsuarioComponent, {
      data: usuario,
    });
    
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.ok) {
        this.dataSource.data = this.dataSource.data.filter(u => u.id !== usuario.id);
      }
    });
  }
applyFilter(value: string): void {
  this.searchText = value;
  this.dataSource.filter = value.trim().toLowerCase();
}
}