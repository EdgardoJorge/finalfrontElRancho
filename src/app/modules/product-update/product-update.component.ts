import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../service/services/product.service';
import { Producto } from '../../service/models/ProductModel';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  standalone: false,
  styleUrls: ['./product-update.component.css']
})
export class ProductUpdateComponent implements OnInit {
  productoForm!: FormGroup;
  producto: Producto | null = null;

  imagen1: File | null = null;
  imagen2: File | null = null;

  imagenUrl1: string = '';
  imagenUrl2: string = '';

  categorias = [
    { id: 1, nombre: 'Carnes' },
    { id: 2, nombre: 'Bebidas' },
    { id: 3, nombre: 'Postres' }
  ];

  constructor(
    private productoService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      precioOferta: ['', [Validators.min(0)]],
      categoria: [null, Validators.required],
      activo: [true, Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.obtenerProducto(id);
    }
  }

  obtenerProducto(id: string): void {
    this.productoService.obtenerProductoPorId(+id).subscribe(producto => {
      this.producto = producto;
      this.productoForm.patchValue(producto);
      this.imagenUrl1 = producto.imagen || '';
      // Si tienes segunda imagen, agrégala aquí
    });
  }

  onImageSelected(event: any, imagenNumero: number): void {
    const file = event.target.files[0];
    if (file) {
      if (imagenNumero === 1) {
        this.imagen1 = file;
        this.subirImagen(file, 1);
      } else {
        this.imagen2 = file;
        this.subirImagen(file, 2);
      }
    }
  }

  subirImagen(file: File, imagenNumero: number): void {
    const formData = new FormData();
    formData.append('file', file);

    this.productoService.subirImagen(formData).subscribe((response: any) => {
      if (imagenNumero === 1) {
        this.imagenUrl1 = response.url;
      } else {
        this.imagenUrl2 = response.url;
      }
    });
  }

  actualizarProducto(): void {
    if (this.productoForm.valid && this.producto) {
      const updatedProduct: Producto = {
        ...this.producto,
        ...this.productoForm.value,
        imagen: this.imagenUrl1 || this.producto.imagen
        // puedes añadir imagen2 si tu modelo lo soporta
      };

      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.productoService.actualizarProducto(+id, updatedProduct).subscribe({
          next: () => this.router.navigate(['/products']),
          error: (err: any) => console.error('Error al actualizar producto', err)
        });
      }
    }
  }

  cancelar(): void {
    this.router.navigate(['/products']);
  }
}
