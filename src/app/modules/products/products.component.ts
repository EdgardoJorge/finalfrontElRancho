import { Component, OnInit } from '@angular/core';
import { Producto } from '../../service/models/ProductModel';
import { ProductService } from '../../service/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  productos: Producto[] = [];
  criterioBusqueda: string = '';

  constructor(
    private productoService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => this.productos = data,
      error: () => console.error('Error al cargar productos')
    });
  }

  buscar(): void {
    if (this.criterioBusqueda.trim() === '') {
      this.obtenerProductos();
    } else {
      this.productoService.buscarProductos(this.criterioBusqueda).subscribe({
        next: (data) => this.productos = data,
        error: () => console.error('Error al buscar productos')
      });
    }
  }

  cambiarEstadoProducto(id: number, estado: boolean): void {
    const producto = this.productos.find(p => p.id === id);
    if (producto) {
      producto.activo = estado;

      // Llamar al servicio para actualizar el producto con el nuevo estado
      this.productoService.actualizarProducto(id, producto).subscribe({
        next: () => this.obtenerProductos(),
        error: () => console.error('Error al cambiar estado del producto')
      });
    }
  }
}
