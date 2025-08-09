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
  enum : 'none' | 'loading' | 'done' | 'error' = 'none'
  category: Categoria[] = [];
  constructor(
    private _category_Service: CategoryService,
  ){}
  ngOnInit(): void {
    this.vercategory()
  }
  vercategory(){
    this.enum = 'loading';
    this._category_Service.obtenerCategorias().subscribe({
      next: (data) => {
        this.enum = 'done';
        this.category = data;
      },
      error(err){
        console.log(err)
      }
    })
  }
}
