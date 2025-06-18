  import { Component, OnInit } from '@angular/core';
  import { Producto } from '../../service/models/ProductModel';
  import { Categoria } from '../../service/models/CategoryModel';
  import { CategoryService } from '../../service/services/category.service';
  import { ProductService } from '../../service/services/product.service';
  // import { Router } from '@angular/router';

  @Component({
    selector: 'app-products',
    standalone: false,
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
  })
  export class ProductsComponent implements OnInit {
    CargaDatos: 'none' | 'loading' | 'done' | 'error' = 'none';
    estadoFiltro: 'todos' | 'activos' | 'inactivos' = 'todos';
    Productos : Producto[] = [];
    Categorias: Categoria[] = [];
    criterioBusqueda: string= ''
    constructor(
      private productosService:ProductService,
      private categoriaService:CategoryService
    ){}
    ngOnInit(): void {
      this.obtenerProductos();
    }
    obtenerProductos(){
      this.CargaDatos = 'loading';
      this.productosService.obtenerProductos().subscribe({
        next: (data) => {
          this.Productos = data;
          console.log(data);
          this.buscarcategoriasporid(); // Llamar aquí después de cargar productos
        },
        error: (err) => {
          console.log(err);
          this.CargaDatos = 'error';
        },
      });
    }
        obtenerNombreCategoria(idCategoria: number): string {
      if (this.CargaDatos === 'loading') {
        return 'Cargando...';
      }
      const categoria = this.Categorias.find(cat => cat.id === idCategoria);
      return categoria ? categoria.categoriaNombre : 'Sin categoría';
    }

  buscarcategoriasporid() {
    this.Categorias = [];
    const categoriasIds = Array.from(new Set(this.Productos
      .filter(p => p.idCategoria !== null && p.idCategoria !== undefined)
      .map(p => p.idCategoria)
    ));

    if (categoriasIds.length === 0) {
      this.CargaDatos = 'error';
      console.log('No se encontraron productos con idCategoria');
      return;
    }

    if (this.CargaDatos === 'done' || this.CargaDatos === 'error') {
      return;
    }
    this.CargaDatos = 'loading';
    let loaded = 0;
    categoriasIds.forEach(idCategoria => {
      this.categoriaService.obtenerCategoriaPorId(idCategoria).subscribe({
        next: (data) => {
          if (data && data.categoriaNombre) {
            this.Categorias.push(data);
          }
          loaded++;
          if (loaded === categoriasIds.length) {
            this.CargaDatos = 'done';
          }
        },
        error: (err) => {
          console.log(err);
          loaded++;
          if (loaded === categoriasIds.length) {
            this.CargaDatos = 'done';
          }
        }
      });
    });
  }
  buscar(): void {
  if (this.criterioBusqueda.trim() === '') {
    this.obtenerProductos();
  } else {
    this.CargaDatos = 'loading';
    this.productosService.buscarProductos(this.criterioBusqueda).subscribe({
      next: (data) => {
        this.Productos = data;
        this.buscarcategoriasporid(); // <-- Reusar lógica de categorías
      },
      error: (err) => {
        console.error('Error al buscar productos', err);
        this.CargaDatos = 'error';
      }
    });
  }
}
alternarEstado(producto: Producto): void {
  if (producto.id === undefined) {
    console.error('El producto no tiene un id definido');
    return;
  }
  const productoActualizado = { ...producto, activo: !producto.activo };

  this.productosService.actualizarProducto(producto.id, productoActualizado).subscribe({
    next: () => {
      producto.activo = productoActualizado.activo; // Actualiza en la UI
    },
    error: (err) => {
      console.error('Error al actualizar el estado del producto', err);
    }
  });
}
  get productosFiltrados(): Producto[] {
  switch (this.estadoFiltro) {
    case 'activos':
      return this.Productos.filter(p => p.activo);
    case 'inactivos':
      return this.Productos.filter(p => !p.activo);
    default:
      return this.Productos;
  }
}
}