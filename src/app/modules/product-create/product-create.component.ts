import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProductService} from '../../service/services/product.service';
import {Producto} from '../../service/models/ProductModel';
import {CategoryService} from '../../service/services/category.service';
import {Categoria} from '../../service/models/CategoryModel';
import { Router } from '@angular/router';
import {ModulesModule} from '../modules.module';

@Component({
  selector: 'app-product-create',
  standalone: false,
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {
  productoForm!: FormGroup;
  categorias: Categoria[] = [];
  imagen1File!: File;
  imagen2File!: File;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      precioOferta: [''],
      categoriaId: [null, Validators.required]
    });

    this.categoryService.obtenerCategorias().subscribe(data => {
      this.categorias = data;
    });
  }

  onFileChange(event: any, imagen: number): void {
    const file = event.target.files[0];
    if (imagen === 1) {
      this.imagen1File = file;
    } else if (imagen === 2) {
      this.imagen2File = file;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.productoForm.invalid) return;

    try {
      const imagenUrls = [];

      if (this.imagen1File) {
        const resp1 = await this.productService.subirImagen(this.imagen1File).toPromise();
        imagenUrls.push(resp1.data.url);
      }

      if (this.imagen2File) {
        const resp2 = await this.productService.subirImagen(this.imagen2File).toPromise();
        imagenUrls.push(resp2.data.url);
      }

      const nuevoProducto: Producto = {
        ...this.productoForm.value,
        imagenes: imagenUrls // Asegúrate de que tu modelo Producto tenga esta propiedad
      };

      this.productService.crearProducto(nuevoProducto).subscribe(() => {
        this.router.navigate(['/productos']); // Redirige si deseas
      });
    } catch (error) {
      console.error('Error al crear producto:', error);
    }
  }
}
