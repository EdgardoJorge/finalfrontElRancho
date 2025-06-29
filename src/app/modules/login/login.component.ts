import { Component } from '@angular/core';
import { AuthAdminService } from '../../service/services/auth.service';
import { AdministradorLoginRequest } from '../../service/models/AuthModel';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  correoElectronico: string = '';
  password: string = '';

  constructor(private authService: AuthAdminService, private router: Router) {}

  login(): void {
    const request: AdministradorLoginRequest = {
      correoElectronico: this.correoElectronico,
      password: this.password
    };

    this.authService.login(request).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        Swal.fire({
          title:"Inicio de sesion satisfactorio",
          text: "Rediriiendo a la pagina principal",
          icon: "success"
        });
        //alert('Inicio de sesión exitoso');
        this.router.navigate(['/dashboard']); // Ruta a la que redirigir tras login
        //console.log(response.token)
      },
      error: (err) => {
        Swal.fire({
          title: "Error",
          text: "Credenciales incorrectas",
          icon: "error"
        });
        //alert('Credenciales inválidas');
      }
    });
  }
}

