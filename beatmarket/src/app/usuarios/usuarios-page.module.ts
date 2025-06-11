import { NgModule } from '@angular/core';
import { UsuariosPageComponent } from './usuarios-page.component';
import { UpdateUsuarioComponent } from './update-usuario/update-usuario.component';
import { AddUsuarioComponent } from './add-usuario/add-usuario.component';
import { DeleteUsuarioComponent } from './delete-usuario/delete-usuario.component';
import { MaterialModule } from '../material/material.module';
import { UsuariosPageRoutingModule } from './usuarios-page-routing.module';

@NgModule({
  declarations: [UsuariosPageComponent,UpdateUsuarioComponent,AddUsuarioComponent,DeleteUsuarioComponent],
  imports: [
    MaterialModule,
    UsuariosPageRoutingModule
  ]
})
export class UsuariosPageModule {}