import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api';

@Component({
  selector: 'app-estoque',
  imports: [CommonModule, FormsModule],
  templateUrl: './estoque.html',
  styleUrl: './estoque.css'
})
export class EstoqueComponent implements OnInit {

  saldo: any[] = [];
  movimentacoes: any[] = [];
  carregando = true;
  abaSelecionada = 'saldo';

  mostrarModalSaida = false;
  ingredienteSelecionado: any = null;
  saida = { quantidade: 0, motivo: 'DESPERDICIO' };
  erroSaida = '';
  sucesso = '';

  motivos = ['DESPERDICIO', 'VENCIMENTO', 'AJUSTE'];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.carregando = true;
    this.apiService.getEstoqueSaldo().subscribe({
      next: (data) => {
        this.saldo = data.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
        this.carregando = false;
      },
      error: () => this.carregando = false
    });

    this.apiService.getEstoqueMovimentacoes().subscribe({
      next: (data) => this.movimentacoes = data,
      error: () => {}
    });
  }

  abrirModalSaida(ingrediente: any) {
    this.ingredienteSelecionado = ingrediente;
    this.saida = { quantidade: 0, motivo: 'DESPERDICIO' };
    this.erroSaida = '';
    this.mostrarModalSaida = true;
  }

  fecharModal() {
    this.mostrarModalSaida = false;
    this.erroSaida = '';
  }

  confirmarSaida() {
    if (!this.saida.quantidade || this.saida.quantidade <= 0) {
      this.erroSaida = 'Informe uma quantidade válida.';
      return;
    }

    const body = {
      ingredienteId: this.ingredienteSelecionado.id,
      quantidade: this.saida.quantidade,
      motivo: this.saida.motivo
    };

    this.apiService.registrarSaidaEstoque(body).subscribe({
      next: () => {
        this.mostrarModalSaida = false;
        this.sucesso = 'Saída registrada com sucesso!';
        this.carregarDados();
        setTimeout(() => this.sucesso = '', 3000);
      },
      error: (err) => {
        this.erroSaida = err.error?.message || 'Erro ao registrar saída.';
      }
    });
  }
}