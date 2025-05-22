import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../service/services/cliente.service';
import { Cliente } from '../../service/models/ClienteModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente',
  standalone: false,
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  criterioBusqueda: string = '';

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.obtenerClientes();
  }

  obtenerClientes(): void {
    this.clienteService.obtenerClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al obtener clientes', err),
    });
  }

  aplicarFiltros(): void {
    let lista = [...this.clientes];

    if (this.criterioBusqueda.trim() !== '') {
      const criterio = this.criterioBusqueda.toLowerCase();
      lista = lista.filter((c) =>
        c.nombres.toLowerCase().includes(criterio) ||
        c.apellidoPaterno.toLowerCase().includes(criterio) ||
        c.apellidoMaterno.toLowerCase().includes(criterio) ||
        c.dni.includes(criterio) ||
        c.ruc.includes(criterio) ||
        c.telefonoMovil.includes(criterio) ||
        c.correoElectronico.toLowerCase().includes(criterio)
      );
    }

    this.clientesFiltrados = lista;
  }

  buscar(): void {
    this.aplicarFiltros();
  }
}

