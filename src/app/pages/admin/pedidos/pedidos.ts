import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api';

@Component({
  selector: 'app-pedidos',
  imports: [CommonModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css'
})
export class PedidosComponent implements OnInit {

  pedidos: any[] = [];
  carregando = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.carregarPedidos();
  }

  carregarPedidos() {
    this.carregando = true;
    this.apiService.listarTodosPedidos().subscribe({
      next: (data) => {
        this.pedidos = data.sort((a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.carregando = false;
      },
      error: () => this.carregando = false
    });
  }

  atualizarStatus(pedidoId: number, novoStatus: string) {
    this.apiService.atualizarStatusPedido(pedidoId, novoStatus).subscribe({
      next: () => this.carregarPedidos(),
      error: (err) => alert('Erro ao atualizar status: ' + (err.error?.message || err.message))
    });
  }

  cancelarPedido(pedidoId: number) {
    const motivo = prompt('Informe o motivo do cancelamento:');
    if (!motivo) return;
    this.apiService.cancelarPedido(pedidoId, motivo).subscribe({
      next: () => this.carregarPedidos(),
      error: (err) => alert('Erro ao cancelar pedido: ' + (err.error?.message || err.message))
    });
  }

  getStatusClass(status: string): string {
    const classes: any = {
      'RECEBIDO': 'status-recebido',
      'CONFIRMADO': 'status-confirmado',
      'EM_PREPARO': 'status-preparo',
      'PRONTO': 'status-pronto',
      'SAIU_ENTREGA': 'status-entrega',
      'FINALIZADO': 'status-finalizado',
      'CANCELADO': 'status-cancelado'
    };
    return classes[status] || '';
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      'RECEBIDO': 'Recebido',
      'CONFIRMADO': 'Confirmado',
      'EM_PREPARO': 'Em Preparo',
      'PRONTO': 'Pronto',
      'SAIU_ENTREGA': 'Saiu para Entrega',
      'FINALIZADO': 'Finalizado',
      'CANCELADO': 'Cancelado'
    };
    return labels[status] || status;
  }

  proximoStatus(status: string): string | null {
    const fluxo: any = {
      'RECEBIDO': 'CONFIRMADO',
      'CONFIRMADO': 'EM_PREPARO',
      'EM_PREPARO': 'PRONTO',
      'PRONTO': 'SAIU_ENTREGA',
      'SAIU_ENTREGA': 'FINALIZADO'
    };
    return fluxo[status] || null;
  }

  proximoStatusLabel(status: string): string {
    const labels: any = {
      'CONFIRMADO': 'Confirmar',
      'EM_PREPARO': 'Iniciar Preparo',
      'PRONTO': 'Marcar Pronto',
      'SAIU_ENTREGA': 'Saiu para Entrega',
      'FINALIZADO': 'Finalizar'
    };
    return labels[this.proximoStatus(status) || ''] || '';
  }
}