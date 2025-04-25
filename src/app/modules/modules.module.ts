import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ModulesRoutingModule } from './modules-routing.module';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
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
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    IndexComponent,
    LoginComponent,
    SidebarComponent,
    NavbarComponent,
    ProductsComponent,
    ProductCreateComponent,
    ProductUpdateComponent,
    CategoryComponent,
    CategoryCreateComponent,
    CategoryUpdateComponent,
    BannerComponent,
    BannerCreateComponent,
    BannerUpdateComponent,
    ComprobantesComponent,
    ReportComponent,
    CalendarComponent,
  ],
  imports: [
    CommonModule,
    ModulesRoutingModule,
    FullCalendarModule,
    HttpClientModule,
    FormsModule
  ]
})
export class ModulesModule { }
