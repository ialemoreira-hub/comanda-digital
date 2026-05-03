import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-meus-pedidos',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './meus-pedidos.html',
  styleUrl: './meus-pedidos.css'
})
export class MeusPedidosComponent implements OnInit {

  pedidos: any[] = [];
  carregando = true;

  mostrarModalAvaliacao = false;
  mostrarModalReporte = false;
  pedidoSelecionado: any = null;
  avaliacao = 0;
  comentario = '';
  reporteTexto = '';
  sucesso = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.carregarPedidos();
  }

  carregarPedidos() {
    this.apiService.meusPedidos().subscribe({
      next: (data) => {
        this.pedidos = data.sort((a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.carregando = false;
      },
      error: () => this.carregando = false
    });
  }

  confirmarRecebimento(pedido: any) {
    if (!confirm('Confirmar que recebeu o pedido?')) return;
    this.apiService.confirmarRecebimento(pedido.id).subscribe({
      next: () => {
        this.sucesso = 'Recebimento confirmado!';
        this.carregarPedidos();
        setTimeout(() => this.sucesso = '', 3000);
      },
      error: () => alert('Erro ao confirmar recebimento.')
    });
  }

  abrirAvaliacao(pedido: any) {
    this.pedidoSelecionado = pedido;
    this.avaliacao = 0;
    this.comentario = '';
    this.mostrarModalAvaliacao = true;
  }

  abrirReporte(pedido: any) {
    this.pedidoSelecionado = pedido;
    this.reporteTexto = '';
    this.mostrarModalReporte = true;
  }

  fecharModais() {
    this.mostrarModalAvaliacao = false;
    this.mostrarModalReporte = false;
    this.pedidoSelecionado = null;
  }

  enviarAvaliacao() {
    if (this.avaliacao === 0) { alert('Selecione uma nota.'); return; }
    const estrelas = '⭐'.repeat(this.avaliacao);
    const feedback = `Avaliação: ${estrelas} (${this.avaliacao}/5)${this.comentario ? ' - ' + this.comentario : ''}`;
    this.apiService.enviarFeedback(this.pedidoSelecionado.id, feedback).subscribe({
      next: () => {
        this.sucesso = 'Avaliação enviada! Obrigado!';
        this.fecharModais();
        this.carregarPedidos();
        setTimeout(() => this.sucesso = '', 3000);
      },
      error: () => alert('Erro ao enviar avaliação.')
    });
  }

  enviarReporte() {
    if (!this.reporteTexto.trim()) { alert('Descreva o problema.'); return; }
    const feedback = `Problema reportado: ${this.reporteTexto}`;
    this.apiService.enviarFeedback(this.pedidoSelecionado.id, feedback).subscribe({
      next: () => {
        this.sucesso = 'Problema reportado! Entraremos em contato.';
        this.fecharModais();
        this.carregarPedidos();
        setTimeout(() => this.sucesso = '', 3000);
      },
      error: () => alert('Erro ao reportar problema.')
    });
  }

  setEstrela(valor: number) {
    this.avaliacao = valor;
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
}