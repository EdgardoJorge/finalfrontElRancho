import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { IndexComponent } from './index/index.component';
import { ProductsComponent } from './products/products.component';

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
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
