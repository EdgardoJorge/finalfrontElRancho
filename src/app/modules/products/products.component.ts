import { Component, OnInit } from '@angular/core';
import { Producto } from '../../service/models/ProductModel';
import { ProductService } from '../../service/services/product.service';
import { Router } from '@angular/router';
import { Categoria } from '../../service/models/CategoryModel';
import { CategoryService } from '../../service/services/category.service';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  productosOriginales: Producto[] = []; // lista sin filtros
  productos: Producto[] = [];            // lista filtrada
  categorias: Categoria[] = [];
  criterioBusqueda: string = '';
  estadoFiltro: 'todos' | 'activos' | 'inactivos' = 'todos';

  constructor(
    private productoService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerCategorias();
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => {
        this.productosOriginales = data;
        this.aplicarFiltros();
      },
      error: () => console.error('Error al cargar productos')
    });
  }

  obtenerCategorias(): void {
    this.categoryService.obtenerCategorias().subscribe({
      next: (data) => (this.categorias = data),
      error: () => console.error('Error al cargar categorías')
    });
  }

  obtenerNombreCategoria(idCategoria: number): string {
    const categoria = this.categorias.find(cat => cat.id === idCategoria);
    return categoria ? categoria.categoriaNombre : 'Desconocido';
  }

  buscar(): void {
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    const texto = this.criterioBusqueda.trim().toLowerCase();

    this.productos = this.productosOriginales.filter(producto => {
      const coincideTexto = texto === '' || producto.nombre.toLowerCase().includes(texto);
      const coincideEstado =
        this.estadoFiltro === 'todos' ||
        (this.estadoFiltro === 'activos' && producto.activo) ||
        (this.estadoFiltro === 'inactivos' && !producto.activo);

      return coincideTexto && coincideEstado;
    });
  }

  filtrarPorEstado(estado: 'todos' | 'activos' | 'inactivos'): void {
    this.estadoFiltro = estado;
    this.aplicarFiltros();
  }

  cambiarEstadoProducto(id: number, estado: boolean): void {
    const producto = this.productos.find(p => p.id === id);
    if (producto) {
      producto.activo = estado;

      this.productoService.actualizarProducto(id, producto).subscribe({
        next: () => this.obtenerProductos(),
        error: () => console.error('Error al cambiar estado del producto')
      });
    }
  }
}
