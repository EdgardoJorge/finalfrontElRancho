import { Component, OnInit } from '@angular/core';
import { Administrador } from '../../service/models/AdminModel';
import { AdministradorService } from '../../service/services/admin.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  administrador: Administrador | null = null;

  constructor(private administradorService: AdministradorService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Payload del token:', payload);

        const adminId = parseInt(payload.sub);
        if (!isNaN(adminId)) {
          this.administradorService.getAdministradorById(adminId).subscribe({
            next: (admin) => {
              this.administrador = admin;
              console.log(admin.nombres);
            },
            error: () => {
              console.warn('No se pudo obtener el administrador');
            }
          });
        } else {
          console.warn('El campo sub del token no es un número válido');
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    } else {
      console.warn('No se encontró ningún token en localStorage');
    }
  }

  get nombreCompleto(): string {
    if (!this.administrador) return '';
    return `${this.administrador.nombres} ${this.administrador.apellidoPaterno} ${this.administrador.apellidoMaterno}`;
  }
}
