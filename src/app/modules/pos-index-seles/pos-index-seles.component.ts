import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/services/product.service';
import { Producto } from '../../service/models/ProductModel';

interface CarritoItem {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

interface Venta {
  id?: number;
  fecha: Date;
  items: CarritoItem[];
  total: number;
  metodoPago: string;
  estado: string;
}

@Component({
  selector: 'app-pos-index-seles',
  standalone: false,
  templateUrl: './pos-index-seles.component.html',
  styleUrl: './pos-index-seles.component.css'
})
export class PosIndexSelesComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  carrito: CarritoItem[] = [];
  terminoBusqueda: string = '';
  metodoPago: string = 'efectivo';
  efectivoRecibido: number = 0;
  cambio: number = 0;
  ventas: Venta[] = [];
  mostrarModalPago: boolean = false;
  ventaEnProceso: boolean = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productService.obtenerProductos().subscribe({
      next: (productos) => {
        this.productos = productos.filter(p => p.activo);
        this.productosFiltrados = [...this.productos];
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
      }
    });
  }

  buscarProductos(): void {
    if (!this.terminoBusqueda.trim()) {
      this.productosFiltrados = [...this.productos];
      return;
    }

    this.productService.buscarProductos(this.terminoBusqueda).subscribe({
      next: (productos) => {
        this.productosFiltrados = productos.filter(p => p.activo);
      },
      error: (error) => {
        console.error('Error al buscar productos:', error);
        this.productosFiltrados = this.productos.filter(p => 
          p.activo && p.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
        );
      }
    });
  }

  agregarAlCarrito(producto: Producto): void {
    const itemExistente = this.carrito.find(item => item.producto.id === producto.id);
    
    if (itemExistente) {
      itemExistente.cantidad++;
      itemExistente.subtotal = itemExistente.cantidad * itemExistente.producto.precio;
    } else {
      this.carrito.push({
        producto,
        cantidad: 1,
        subtotal: producto.precio
      });
    }
  }

  actualizarCantidad(item: CarritoItem, nuevaCantidad: number): void {
    if (nuevaCantidad <= 0) {
      this.eliminarDelCarrito(item);
      return;
    }
    
    item.cantidad = nuevaCantidad;
    item.subtotal = item.cantidad * item.producto.precio;
  }

  eliminarDelCarrito(item: CarritoItem): void {
    const index = this.carrito.indexOf(item);
    if (index > -1) {
      this.carrito.splice(index, 1);
    }
  }

  get totalCarrito(): number {
    return this.carrito.reduce((total, item) => total + item.subtotal, 0);
  }

  get totalItems(): number {
    return this.carrito.reduce((total, item) => total + item.cantidad, 0);
  }

  calcularCambio(): void {
    this.cambio = this.efectivoRecibido - this.totalCarrito;
  }

  abrirModalPago(): void {
    if (this.carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    this.mostrarModalPago = true;
    this.efectivoRecibido = 0;
    this.cambio = 0;
  }

  cerrarModalPago(): void {
    this.mostrarModalPago = false;
    this.efectivoRecibido = 0;
    this.cambio = 0;
  }

  procesarVenta(): void {
    if (this.metodoPago === 'efectivo' && this.efectivoRecibido < this.totalCarrito) {
      alert('El efectivo recibido es menor al total');
      return;
    }

    this.ventaEnProceso = true;

    const nuevaVenta: Venta = {
      fecha: new Date(),
      items: [...this.carrito],
      total: this.totalCarrito,
      metodoPago: this.metodoPago,
      estado: 'completada'
    };

    // Aquí normalmente se enviaría la venta al backend
    // Por ahora la guardamos localmente
    this.ventas.unshift(nuevaVenta);
    
    // Limpiar carrito
    this.carrito = [];
    this.cerrarModalPago();
    this.ventaEnProceso = false;
    
    alert('Venta procesada exitosamente');
  }

  limpiarCarrito(): void {
    if (confirm('¿Estás seguro de que quieres limpiar el carrito?')) {
      this.carrito = [];
    }
  }

  imprimirTicket(venta: Venta): void {
    // Aquí se implementaría la lógica de impresión
    console.log('Imprimiendo ticket:', venta);
    alert('Ticket enviado a impresora');
  }
}
