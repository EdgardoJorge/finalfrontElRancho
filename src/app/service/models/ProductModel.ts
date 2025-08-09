export class Producto {
  id: number = 0;
  nombre: string = "";
  descripcion: string = "";
  precio: number = 0;
  precio_Oferta: number | null = null;
  activo: boolean = true;
  idCategoria: number = 0;
}