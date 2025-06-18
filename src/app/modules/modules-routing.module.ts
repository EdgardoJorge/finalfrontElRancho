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
import { BannerUpdateComponent } from './banner-update/banner-update.component';
import { ComprobantesComponent } from './comprobantes/comprobantes.component';
import { ReportComponent } from './report/report.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CustomersComponent } from './customers/customers.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { CreateDeliveryComponent } from './create-delivery/create-delivery.component';

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
    },
    {
      path: 'banner/update/:id',
      component: BannerUpdateComponent
    },
    {
      path: 'comprobantes',
      component: ComprobantesComponent
    },
    {
      path: 'report',
      component: ReportComponent,
    },
    {
      path: 'calendar',
      component: CalendarComponent,
    },
    {
      path: 'customers',
      component: CustomersComponent,
    },
    {
      path: 'employees',
      component: DeliveryComponent,
    },
    {
      path: 'employees/create',
      component: CreateDeliveryComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
