import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../service/models/ClienteModel';
import { ClienteService } from '../../service/services/cliente.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cliente-create',
  standalone: false,
  templateUrl: './cliente-create.component.html',
  styleUrls: ['./cliente-create.component.css']
})
export class ClienteCreateComponent implements OnInit {
  clienteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.clienteForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      dni: ['', Validators.required],
      ruc: ['', Validators.required],
      telefonoMovil: ['', Validators.required],
      telefonoFijo: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
      codigoPostal: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  crearCliente(): void {
    if (this.clienteForm.invalid) {
      this.snackBar.open('Formulario inválido. Por favor, revise los campos.', 'Cerrar', { duration: 3000 });
      this.clienteForm.markAllAsTouched();
      return;
    }

    this.clienteService.crearCliente(this.clienteForm.value).subscribe({
      next: () => {
        this.snackBar.open('Cliente creado exitosamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/cliente']);
      },
      error: (err) => {
        this.snackBar.open('Error al crear cliente', 'Cerrar', { duration: 3000 });
        console.error('Error al crear cliente:', err);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/cliente']);
  }
}
