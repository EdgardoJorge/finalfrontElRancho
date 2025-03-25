import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { IndexComponent } from './index/index.component';
import { ProductsComponent } from './products/products.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductUpdateComponent } from './product-update/product-update.component';
import { CategoryComponent } from './category/category.component';
import { CategoryCreateComponent } from './category-create/category-create.component';
import { CategoryUpdateComponent } from './category-update/category-update.component';
import { BannerComponent } from './banner/banner.component';
import { BannerCreateComponent } from './banner-create/banner-create.component';

const routes: Routes = [
    {
      path: '',
      component: LoginComponent
    },
    {
      path: 'dashboard',
      component: IndexComponent
    },
    {
      path: 'products',
      component: ProductsComponent
    },
    {
      path: 'product/create',
      component: ProductCreateComponent
    },
    {
      path: 'product/update/:id',
      component: ProductUpdateComponent
    },
    {
      path: 'category',
      component: CategoryComponent
    },
    {
      path: 'category/create',
      component: CategoryCreateComponent
    },
    {
      path: 'category/update/:id',
      component: CategoryUpdateComponent  
    },
    {
      path: 'banner',
      component: BannerComponent
    },
    {
      path: 'banner/create',
      component: BannerCreateComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
