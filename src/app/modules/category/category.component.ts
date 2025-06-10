import { Component, OnInit } from '@angular/core';
import {CategoryService} from '../../service/services/category.service';
import {Categoria} from '../../service/models/CategoryModel';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  categorias: Categoria[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoryService.obtenerCategorias().subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data); // 👈 Agrega esto
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error al obtener categorías', err);
      }
    });
  }
}
