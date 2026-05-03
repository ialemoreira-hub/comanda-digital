import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api';

@Component({
  selector: 'app-compras',
  imports: [CommonModule, FormsModule],
  templateUrl: './compras.html',
  styleUrl: './compras.css'
})
export class ComprasComponent implements OnInit {

  compras: any[] = [];
  fornecedores: any[] = [];
  ingredientes: any[] = [];
  carregando = true;
  sucesso = '';

  mostrarModal = false;
  form: any = {
    fornecedorId: null,
    itens: [{ ingredienteId: null, quantidade: 0, precoUnitario: 0 }]
  };
  erro = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.carregando = true;
    this.apiService.getCompras().subscribe({
      next: (data) => { this.compras = data; this.carregando = false; },
      error: () => this.carregando = false
    });
    this.apiService.getFornecedores().subscribe({
      next: (data) => this.fornecedores = data,
      error: () => {}
    });
    this.apiService.getEstoqueSaldo().subscribe({
      next: (data) => this.ingredientes = data,
      error: () => {}
    });
  }

  abrirModal() {
    this.form = {
      fornecedorId: null,
      itens: [{ ingredienteId: null, quantidade: 0, precoUnitario: 0 }]
    };
    this.erro = '';
    this.mostrarModal = true;
  }

  fecharModal() {
    this.mostrarModal = false;
    this.erro = '';
  }

  adicionarItem() {
    this.form.itens.push({ ingredienteId: null, quantidade: 0, precoUnitario: 0 });
  }

  removerItem(index: number) {
    this.form.itens.splice(index, 1);
  }

  calcularTotal(): number {
    return this.form.itens.reduce((total: number, item: any) =>
      total + (item.quantidade * item.precoUnitario), 0);
  }

  salvarCompra() {
    if (!this.form.fornecedorId) { this.erro = 'Selecione um fornecedor.'; return; }
    if (this.form.itens.some((i: any) => !i.ingredienteId || i.quantidade <= 0 || i.precoUnitario <= 0)) {
      this.erro = 'Preencha todos os itens corretamente.'; return;
    }

    this.apiService.criarCompra(this.form).subscribe({
      next: () => {
        this.mostrarModal = false;
        this.sucesso = 'Pedido de compra criado com sucesso!';
        this.carregarDados();
        setTimeout(() => this.sucesso = '', 3000);
      },
      error: (err) => this.erro = err.error?.message || 'Erro ao criar compra.'
    });
  }

  receberCompra(id: number) {
    if (!confirm('Confirmar recebimento? Isso vai dar entrada no estoque.')) return;
    this.apiService.receberCompra(id).subscribe({
      next: () => {
        this.sucesso = 'Recebimento registrado! Estoque atualizado.';
        this.carregarDados();
        setTimeout(() => this.sucesso = '', 3000);
      },
      error: (err) => alert('Erro: ' + (err.error?.message || err.message))
    });
  }

  enviarCompra(id: number) {
    this.apiService.atualizarStatusCompra(id, 'ENVIADO').subscribe({
      next: () => { this.sucesso = 'Pedido enviado ao fornecedor!'; this.carregarDados(); setTimeout(() => this.sucesso = '', 3000); },
      error: (err) => alert('Erro: ' + (err.error?.message || err.message))
    });
  }

  getStatusClass(status: string): string {
    const classes: any = {
      'RASCUNHO': 'status-rascunho',
      'ENVIADO': 'status-enviado',
      'RECEBIDO': 'status-recebido',
      'CANCELADO': 'status-cancelado'
    };
    return classes[status] || '';
  }
}