import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../service/services/product.service';
import { Producto } from '../../service/models/ProductModel';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../../service/services/category.service';
import { Categoria } from '../../service/models/CategoryModel';
import { ImagenService } from '../../service/services/imagen.service';
import { Imagen } from '../../service/models/ImagenModel';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  standalone: false,
  styleUrls: ['./product-update.component.css']
})
export class ProductUpdateComponent implements OnInit {
onImageSelected($event: Event,arg1: number) {
throw new Error('Method not implemented.');
}
  productoForm!: FormGroup;
  producto: Producto | null = null;
  productId: number = 0;
  loading = false;
  
  // Manejo de categorías
  categorias: Categoria[] = [];
  
  // Manejo de imágenes existentes
  imagenesExistentes: Imagen[] = [];
  
  // Nuevas imágenes seleccionadas
  imagen1File: File | null = null;
  imagen2File: File | null = null;
  
  // URLs para preview
  imagen1Preview: string = '';
  imagen2Preview: string = '';
  
  // Control de imágenes que se van a eliminar
  imagenesAEliminar: Imagen[] = [];

  constructor(
    private productoService: ProductService,
    private categoryService: CategoryService,
    private imagenService: ImagenService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productId = +id;
      this.obtenerProducto(id);
      this.cargarImagenesExistentes(+id);
    }
  }

  initForm(): void {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      precioOferta: [''],
      categoriaId: [null, Validators.required]
    });
  }

  loadCategories(): void {
    this.categoryService.obtenerCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.snackBar.open('Error al cargar las categorías', 'Cerrar', { duration: 3000 });
      }
    });
  }

  obtenerProducto(id: string): void {
    this.productoService.obtenerProductoPorId(+id).subscribe({
      next: (producto) => {
        this.producto = producto;
        // Solo llenar los campos del producto (sin imagen)
        this.productoForm.patchValue({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          precioOferta: producto.precio_Oferta,
          categoriaId: producto.idCategoria
        });
      },
      error: (error) => {
        console.error('Error al obtener producto:', error);
        this.snackBar.open('Error al cargar el producto', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cargarImagenesExistentes(productId: number): void {
    this.imagenService.getByProductId(productId).subscribe({
      next: (imagenes) => {
        this.imagenesExistentes = imagenes;
        // Asignar las primeras dos imágenes a las previews
        if (imagenes.length > 0) {
          this.imagen1Preview = imagenes[0].imagenes;
        }
        if (imagenes.length > 1) {
          this.imagen2Preview = imagenes[1].imagenes;
        }
      },
      error: (error) => {
        console.error('Error al cargar imágenes:', error);
      }
    });
  }

  onFileChange(event: any, imageNumber: number): void {
    const file = event.target.files?.[0];
    
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        this.snackBar.open('Por favor seleccione solo archivos de imagen', 'Cerrar', { duration: 3000 });
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('La imagen debe ser menor a 5MB', 'Cerrar', { duration: 3000 });
        return;
      }

      // Asignar el archivo y crear preview
      if (imageNumber === 1) {
        this.imagen1File = file;
        this.imagen1Preview = URL.createObjectURL(file);
        // Marcar imagen existente para eliminar si existe
        if (this.imagenesExistentes.length > 0) {
          this.marcarImagenParaEliminar(this.imagenesExistentes[0]);
        }
      } else if (imageNumber === 2) {
        this.imagen2File = file;
        this.imagen2Preview = URL.createObjectURL(file);
        // Marcar imagen existente para eliminar si existe
        if (this.imagenesExistentes.length > 1) {
          this.marcarImagenParaEliminar(this.imagenesExistentes[1]);
        }
      }
    }
  }

  marcarImagenParaEliminar(imagen: Imagen): void {
    if (!this.imagenesAEliminar.some(img => img.id === imagen.id)) {
      this.imagenesAEliminar.push(imagen);
    }
  }

  removerImagen(imageNumber: number): void {
    if (imageNumber === 1) {
      this.imagen1File = null;
      this.imagen1Preview = '';
      // Si había una imagen existente, quitarla de la lista de eliminación
      if (this.imagenesExistentes.length > 0) {
        this.imagenesAEliminar = this.imagenesAEliminar.filter(
          img => img.id !== this.imagenesExistentes[0].id
        );
      }
    } else if (imageNumber === 2) {
      this.imagen2File = null;
      this.imagen2Preview = '';
      // Si había una imagen existente, quitarla de la lista de eliminación
      if (this.imagenesExistentes.length > 1) {
        this.imagenesAEliminar = this.imagenesAEliminar.filter(
          img => img.id !== this.imagenesExistentes[1].id
        );
      }
    }
  }

  async actualizarProducto(): Promise<void> {
    if (!this.productoForm.valid || !this.producto || this.loading) {
      this.snackBar.open('Formulario inválido. Revisa los campos.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.loading = true;

    try {
      // 1. Actualizar solo los datos del producto (sin imágenes)
      const updatedProduct: Producto = {
        ...this.producto,
        nombre: this.productoForm.value.nombre,
        descripcion: this.productoForm.value.descripcion,
        precio: this.productoForm.value.precio,
        precio_Oferta: this.productoForm.value.precioOferta,
        idCategoria: this.productoForm.value.idCategoria,
      };

      await this.productoService.actualizarProducto(this.productId, updatedProduct).toPromise();

      // 2. Eliminar imágenes marcadas para eliminación
      for (const imagen of this.imagenesAEliminar) {
        await this.imagenService.delete(imagen.id, imagen.imagenes);
      }

      // 3. Subir nuevas imágenes
      await this.subirNuevasImagenes();

      this.snackBar.open('Producto actualizado correctamente', 'Cerrar', { duration: 3000 });
      
      setTimeout(() => {
        this.router.navigate(['/productos']);
      }, 1500);

    } catch (error) {
      console.error('Error al actualizar producto:', error);
      this.snackBar.open('Error al actualizar el producto', 'Cerrar', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  private async subirNuevasImagenes(): Promise<void> {
    const uploadPromises: Promise<Imagen>[] = [];

    // Subir nueva imagen 1 si existe
    if (this.imagen1File) {
      uploadPromises.push(
        this.imagenService.create(this.imagen1File, this.productId)
      );
    }

    // Subir nueva imagen 2 si existe
    if (this.imagen2File) {
      uploadPromises.push(
        this.imagenService.create(this.imagen2File, this.productId)
      );
    }

    if (uploadPromises.length > 0) {
      await Promise.all(uploadPromises);
    }
  }

  // Método para obtener preview de imagen (para el template)
  getImagePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  cancelar(): void {
    this.router.navigate(['/productos']);
  }

  // Limpiar URLs de objeto cuando el componente se destruye
  ngOnDestroy(): void {
    if (this.imagen1Preview && this.imagen1File) {
      URL.revokeObjectURL(this.imagen1Preview);
    }
    if (this.imagen2Preview && this.imagen2File) {
      URL.revokeObjectURL(this.imagen2Preview);
    }
  }
}