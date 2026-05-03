import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CommonModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayoutComponent {

 menuItems = [
    { label: 'Dashboard', rota: '/admin/dashboard' },
    { label: 'Pedidos', rota: '/admin/pedidos' },
    { label: 'Cardapio', rota: '/admin/pratos' },
    { label: 'Categorias', rota: '/admin/categorias' },
    { label: 'Estoque', rota: '/admin/estoque' },
    { label: 'Compras', rota: '/admin/compras' },
  ];
}