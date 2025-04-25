import { Component, OnInit } from '@angular/core';
import { Producto } from '../../service/models/ProductModel';
import { ProductoService } from '../../service/services/product.service';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit{
  productos: Producto[] = [];

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => this.productos = data,
      error: () => console.error('Error al cargar productos')
    });
  }
}