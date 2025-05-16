import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../service/models/ProductModel';
import { ProductService } from '../../service/services/product.service';
import { CategoryService } from '../../service/services/category.service';
import { Categoria } from '../../service/models/CategoryModel';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-create',
  standalone: false,
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {
  productoForm: FormGroup;
  categorias: Categoria[] = [];

  // Variables para imágenes
  imagen1: File | null = null;
  imagen2: File | null = null;
  imagen3: File | null = null;
  imagenUrl1: string = '';
  imagenUrl2: string = '';
  imagenUrl3: string = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      precioOferta: ['', [Validators.min(0)]],
      idCategoria: [null, Validators.required],
      activo: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    this.categoryService.obtenerCategorias().subscribe({
      next: cats => this.categorias = cats,
      error: () => this.snackBar.open('Error al cargar categorías', 'Cerrar', { duration: 3000 })
    });
  }

  onImageSelected(event: any, slot: number): void {
    const file = event.target.files[0];
    if (!file) return;

    switch (slot) {
      case 1:
        this.imagen1 = file;
        this.uploadImage(file, 1);
        break;
      case 2:
        this.imagen2 = file;
        this.uploadImage(file, 2);
        break;
      case 3:
        this.imagen3 = file;
        this.uploadImage(file, 3);
        break;
    }
  }

  private uploadImage(file: File, slot: number) {
    this.productService.subirImagen(file).subscribe({
      next: (resp: any) => {
        const url = resp.data?.url;
        switch (slot) {
          case 1:
            this.imagenUrl1 = url;
            break;
          case 2:
            this.imagenUrl2 = url;
            break;
          case 3:
            this.imagenUrl3 = url;
            break;
        }
      },
      error: () => this.snackBar.open('Error subiendo imagen', 'Cerrar', { duration: 3000 })
    });
  }

  crearProducto(): void {
    if (this.productoForm.invalid) {
      this.snackBar.open('Formulario inválido', 'Cerrar', { duration: 3000 });
      return;
    }

    const formValue = this.productoForm.value;
    const nuevoProducto: Producto = {
      id: 0,
      nombre: formValue.nombre,
      descripcion: formValue.descripcion,
      precio: parseFloat(formValue.precio),
      idCategoria: formValue.idCategoria,
      activo: formValue.activo,
      imagen: this.imagenUrl1,
      imagen2: this.imagenUrl2,
      imagen3: this.imagenUrl3
    };

    this.productService.crearProducto(nuevoProducto).subscribe({
      next: () => {
        this.snackBar.open('Producto creado', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/products']);
      },
      error: () => this.snackBar.open('Error al crear producto', 'Cerrar', { duration: 3000 })
    });
  }

  cancelar(): void {
    this.router.navigate(['/products']);
  }
}