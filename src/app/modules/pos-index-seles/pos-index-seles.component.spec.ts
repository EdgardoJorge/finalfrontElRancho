import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosIndexSelesComponent } from './pos-index-seles.component';

describe('PosIndexSelesComponent', () => {
  let component: PosIndexSelesComponent;
  let fixture: ComponentFixture<PosIndexSelesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PosIndexSelesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosIndexSelesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
