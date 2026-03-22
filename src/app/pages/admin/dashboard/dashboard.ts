import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {

  kpis = [
    { titulo: 'Faturamento do Dia', valor: 'R$ 1.250,00', icone: '💰', cor: '#27ae60' },
    { titulo: 'Total de Pedidos', valor: '18', icone: '📋', cor: '#3498db' },
    { titulo: 'Ticket Médio', valor: 'R$ 69,44', icone: '🎯', cor: '#9b59b6' },
    { titulo: 'Food Cost Médio', valor: '28%', icone: '📊', cor: '#e67e22' },
  ];

  topPratos = [
    { nome: 'Picanha na Brasa', quantidade: 12, emoji: '🥩' },
    { nome: 'Frango Grelhado', quantidade: 9, emoji: '🍗' },
    { nome: 'Massa ao Molho', quantidade: 7, emoji: '🍝' },
    { nome: 'Petit Gateau', quantidade: 6, emoji: '🍫' },
    { nome: 'Bruschetta', quantidade: 5, emoji: '🥖' },
  ];

  alertasEstoque = [
    { nome: 'Picanha', estoque: 0.5, minimo: 2, unidade: 'kg' },
    { nome: 'Creme de Leite', estoque: 1, minimo: 3, unidade: 'L' },
    { nome: 'Farinha de Trigo', estoque: 0.8, minimo: 2, unidade: 'kg' },
  ];

  pedidosRecentes = [
    { id: 1, cliente: 'João Silva', total: 89.90, status: 'PRONTO' },
    { id: 2, cliente: 'Maria Santos', total: 42.90, status: 'EM_PREPARO' },
    { id: 3, cliente: 'Pedro Costa', total: 135.80, status: 'CONFIRMADO' },
    { id: 4, cliente: 'Ana Lima', total: 67.70, status: 'RECEBIDO' },
  ];
}