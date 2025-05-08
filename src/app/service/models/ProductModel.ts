export interface Producto {
    id?: number; // opcional al crear
    nombre: string;
    descripcion: string;
    precio: number;
    activo: boolean;
    imagen: string;
    imagen2: string;
    imagen3?: string;
    IdCategoria: number;
  }
  