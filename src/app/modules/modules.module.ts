import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModulesRoutingModule } from './modules-routing.module';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductsComponent } from './products/products.component';


@NgModule({
  declarations: [
    IndexComponent,
    LoginComponent,
    SidebarComponent,
    NavbarComponent,
    ProductsComponent
  ],
  imports: [
    CommonModule,
    ModulesRoutingModule
  ]
})
export class ModulesModule { }
