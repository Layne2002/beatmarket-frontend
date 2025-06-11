export enum Roles {
  Usuario = 0,
  Admin = 1
}

export interface Role {
  id_rol?: number;
  rol: string;
  observaciones: string;
}
