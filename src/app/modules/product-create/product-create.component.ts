import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../service/services/product.service';
import { Producto } from '../../service/models/ProductModel';
import { CategoryService } from '../../service/services/category.service';
import { Categoria } from '../../service/models/CategoryModel';
import { Router } from '@angular/router';
import { Imagen } from '../../service/models/ImagenModel';
import { ImagenService } from '../../service/services/imagen.service';

@Component({
  selector: 'app-product-create',
  standalone: false,
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit, OnDestroy {
  productoForm: FormGroup;
  categorias: Categoria[] = [];
  loading = false;
  
  // Propiedades para manejar las imágenes
  imagen1File: File | null = null;
  imagen2File: File | null = null;
  
  // Mensajes de estado
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private imagenService: ImagenService,
    public router: Router
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      precio: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.min(0)]],
      precioOferta: ['', [Validators.min(0)]],
      // CORREGIDO: Cambié de idCategoria a categoriaId para que coincida con el HTML
      categoriaId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    // Limpiar las URLs de objeto para liberar memoria
    this.cleanupImagePreviews();
  }

  private cleanupImagePreviews(): void {
    // Limpiar cache y URLs
    this.imagePreviewCache.forEach((url) => {
      URL.revokeObjectURL(url);
    });
    this.imagePreviewCache.clear();
  }

  loadCategories(): void {
    this.categoryService.obtenerCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        console.log('✅ Categorías cargadas:', data);
      },
      error: (error) => {
        console.error('❌ Error al cargar categorías:', error);
        this.errorMessage = 'Error al cargar las categorías. Intente recargar la página.';
      }
    });
  }

  onFileChange(event: any, imageNumber: number): void {
    const file = event.target.files?.[0];
    
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Solo se permiten archivos de imagen (JPEG, PNG, etc.)';
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'La imagen debe ser menor a 5MB';
        return;
      }

      // Asignar el archivo según el número de imagen
      if (imageNumber === 1) {
        this.imagen1File = file;
        console.log('✅ Imagen 1 seleccionada:', file.name);
      } else if (imageNumber === 2) {
        this.imagen2File = file;
        console.log('✅ Imagen 2 seleccionada:', file.name);
      }
      
      // Limpiar mensajes de error
      this.errorMessage = '';
    }
  }

  // Cache para evitar recrear URLs innecesariamente
  private imagePreviewCache = new Map<File, string>();

  getImagePreview(file: File): string {
    // Si ya existe en cache, devolver la URL existente
    if (this.imagePreviewCache.has(file)) {
      return this.imagePreviewCache.get(file)!;
    }
    
    // Crear nueva URL y guardar en cache
    const url = URL.createObjectURL(file);
    this.imagePreviewCache.set(file, url);
    return url;
  }

  removeImage(imageNumber: number): void {
    if (imageNumber === 1 && this.imagen1File) {
      // Limpiar de cache
      const url = this.imagePreviewCache.get(this.imagen1File);
      if (url) {
        URL.revokeObjectURL(url);
        this.imagePreviewCache.delete(this.imagen1File);
      }
      this.imagen1File = null;
    } else if (imageNumber === 2 && this.imagen2File) {
      // Limpiar de cache
      const url = this.imagePreviewCache.get(this.imagen2File);
      if (url) {
        URL.revokeObjectURL(url);
        this.imagePreviewCache.delete(this.imagen2File);
      }
      this.imagen2File = null;
    }
  }

  private validateForm(): boolean {
    console.log('🔍 Validando formulario...');
    console.log('Form valid:', this.productoForm.valid);
    console.log('Form values:', this.productoForm.value);
    console.log('Form errors:', this.productoForm.errors);
    
    // Mostrar errores específicos de cada campo
    Object.keys(this.productoForm.controls).forEach(key => {
      const control = this.productoForm.get(key);
      if (control && control.invalid) {
        console.log(`❌ Campo '${key}' inválido:`, control.errors);
      }
    });

    // Validar formulario
    if (this.productoForm.invalid) {
      this.markFormGroupTouched();
      this.errorMessage = 'Por favor complete todos los campos requeridos correctamente';
      return false;
    }

    // Validar al menos una imagen
    if (!this.imagen1File) {
      this.errorMessage = 'Debe seleccionar al menos una imagen para el producto';
      return false;
    }

    console.log('✅ Formulario válido');
    return true;
  }

  private prepareProductData(): Producto {
    const formValue = this.productoForm.value;
    
    // Crear instancia usando tu clase Producto
    const productData = new Producto();
    productData.id = 0;
    productData.nombre = formValue.nombre.trim();
    productData.descripcion = formValue.descripcion.trim();
    productData.precio = parseFloat(formValue.precio);
    productData.precio_Oferta = formValue.precioOferta ? parseFloat(formValue.precioOferta) : null;
    productData.idCategoria = parseInt(formValue.categoriaId, 10);
    productData.activo = true;
    
    console.log('📦 Datos del producto preparados:', productData);
    console.log('📦 Tipo de precio:', typeof productData.precio, productData.precio);
    console.log('📦 Tipo de idCategoria:', typeof productData.idCategoria, productData.idCategoria);
    
    return productData;
  }

  async onSubmit(): Promise<void> {
    console.log('🚀 Iniciando envío del formulario...');
    
    // Validaciones
    if (!this.validateForm() || this.loading) {
      console.log('❌ Validación fallida o ya está cargando');
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      // 1. Preparar datos del producto
      const productData = this.prepareProductData();
      
      console.log('📤 Enviando producto al servidor...');
      
      // 2. Crear el producto usando async/await en lugar de toPromise() que está deprecated
      const productoResponse = await new Promise<Producto>((resolve, reject) => {
        this.productService.crearProducto(productData).subscribe({
          next: (response: Producto) => {
            console.log('✅ Respuesta del servidor:', response);
            resolve(response);
          },
          error: (error: any) => {
            console.error('❌ Error del servidor:', error);
            reject(error);
          }
        });
      });
      
      if (!productoResponse || !productoResponse.id) {
        throw new Error('El servidor no devolvió un ID de producto válido');
      }

      const productId = productoResponse.id;
      console.log('✅ Producto creado con ID:', productId);

      // 3. Subir las imágenes a S3 y guardar referencias
      await this.uploadImagesToS3(productId);

      // Éxito
      this.successMessage = 'Producto creado exitosamente! Redirigiendo...';
      console.log('🎉 Producto creado exitosamente');
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        this.router.navigate(['/productos']);
      }, 2000);

    } catch (error: any) {
      console.error('❌ Error al crear producto:', error);
      this.handleSubmissionError(error);
    } finally {
      this.loading = false;
    }
  }

  private async uploadImagesToS3(productId: number): Promise<void> {
    try {
      console.log('📤 Subiendo imágenes...');
      
      // Subir imagen 1 (obligatoria)
      if (this.imagen1File) {
        console.log('📤 Subiendo imagen 1...');
        try {
          const response1 = await this.imagenService.create(this.imagen1File, productId);
          console.log('✅ Imagen 1 subida exitosamente:', response1);
        } catch (imgError) {
          console.error('❌ Error específico imagen 1:', imgError);
          throw new Error(`Error al subir imagen 1: ${imgError}`);
        }
      }

      // Subir imagen 2 (opcional)
      if (this.imagen2File) {
        console.log('📤 Subiendo imagen 2...');
        try {
          const response2 = await this.imagenService.create(this.imagen2File, productId);
          console.log('✅ Imagen 2 subida exitosamente:', response2);
        } catch (imgError) {
          console.error('❌ Error específico imagen 2:', imgError);
          // Para imagen 2 (opcional), no lanzamos error, solo advertencia
          console.warn('⚠️ No se pudo subir la imagen 2, pero continuando...');
        }
      }
      
      console.log('✅ Proceso de subida de imágenes completado');
      
    } catch (error: any) {
      console.error('❌ Error al subir imágenes:', error);
      
      // Verificar si es error de AWS S3 específico
      if (error.message && error.message.includes('readableStream.getReader')) {
        throw new Error('Error de configuración de AWS S3. Verifique la configuración del ImagenService.');
      }
      
      throw new Error('Ocurrió un error al subir las imágenes. El producto fue creado pero sin imágenes.');
    }
  }

  private handleSubmissionError(error: any): void {
    console.log('🔍 Analizando error:', error);
    
    // Manejar diferentes tipos de errores
    if (error.error?.errors) {
      // Errores de validación del backend
      const backendErrors = Object.values(error.error.errors).flat();
      this.errorMessage = backendErrors.join('\n');
    } else if (error.status === 400) {
      this.errorMessage = 'Datos inválidos. Verifique los campos del formulario.';
    } else if (error.status === 401) {
      this.errorMessage = 'No autorizado. Su sesión puede haber expirado.';
    } else if (error.status === 403) {
      this.errorMessage = 'No tiene permiso para realizar esta acción.';
    } else if (error.status === 500) {
      this.errorMessage = 'Error interno del servidor. Intente más tarde.';
    } else if (error.message) {
      this.errorMessage = error.message;
    } else {
      this.errorMessage = 'Error desconocido. Por favor intente nuevamente.';
    }
    
    console.log('❌ Mensaje de error final:', this.errorMessage);
  }

  private markFormGroupTouched(): void {
    Object.values(this.productoForm.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched();
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.productoForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.productoForm.get(field);
    
    if (!control || !control.errors) return '';
    
    if (control.errors['required']) {
      return 'Este campo es requerido';
    }
    if (control.errors['pattern']) {
      return 'Formato inválido';
    }
    if (control.errors['min']) {
      return `El valor mínimo permitido es ${control.errors['min'].min}`;
    }
    if (control.errors['maxlength']) {
      return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    }
    
    return 'Valor inválido';
  }
}