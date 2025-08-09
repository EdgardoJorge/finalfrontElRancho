import { Component, OnInit } from '@angular/core';
import { Banner } from '../../service/models/BannerModel';
import { BannerService } from '../../service/services/banner.service';

@Component({
  selector: 'app-banner',
  standalone: false,
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent implements OnInit{
  enum: 'none' | 'loading' | 'done' | 'error' = 'none'
  banner: Banner[] = [];
  constructor(
    private _banner_service : BannerService
  ){}
  ngOnInit(): void {
    this.getall()
  }
  getall(){
    this.enum = 'loading';
    this._banner_service.getall().subscribe({
      next: (data) => {
        this.enum = 'done'
        this.banner = data
      }, error (err){
        console.log(err)
      }
    })
  }
}
