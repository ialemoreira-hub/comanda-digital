import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api';

@Component({
  selector: 'app-pratos',
  imports: [CommonModule, FormsModule],
  templateUrl: './pratos.html',
  styleUrl: './pratos.css'
})
export class PratosComponent implements OnInit {

  pratos: any[] = [];
  categorias: any[] = [];
  mostrarFormulario = false;
  editando = false;
  erro = '';
  sucesso = '';
  carregando = true;

  form: any = {
    nome: '', descricao: '', preco: 0, fotoUrl: '',
    tempoPreparo: 0, categoriaId: null, status: 'ATIVO'
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.carregarPratos();
    this.carregarCategorias();
  }

  carregarPratos() {
    this.carregando = true;
    this.apiService.getPratosAdmin(0, 100).subscribe({
      next: (data: any) => {
        this.pratos = data.content || data;
        this.carregando = false;
      },
      error: () => this.carregando = false
    });
  }

  carregarCategorias() {
    this.apiService.getCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: () => {}
    });
  }

  abrirFormulario() {
    this.form = {
      nome: '', descricao: '', preco: 0, fotoUrl: '',
      tempoPreparo: 0, categoriaId: null, status: 'ATIVO'
    };
    this.editando = false;
    this.erro = '';
    this.mostrarFormulario = true;
  }

  editar(prato: any) {
    this.form = {
      id: prato.id,
      nome: prato.nome,
      descricao: prato.descricao,
      preco: prato.precoVenda,
      fotoUrl: prato.fotoUrl || '',
      tempoPreparo: prato.tempoPreparo,
      categoriaId: prato.categoriaId,
      status: prato.status
    };
    this.editando = true;
    this.erro = '';
    this.mostrarFormulario = true;
  }

  salvar() {
    if (!this.form.nome || !this.form.categoriaId || this.form.preco <= 0) {
      this.erro = 'Preencha todos os campos obrigatórios!';
      return;
    }

    const dto = {
      nome: this.form.nome,
      descricao: this.form.descricao,
      precoVenda: this.form.preco,
      fotoUrl: this.form.fotoUrl,
      tempoPreparo: this.form.tempoPreparo,
      categoriaId: this.form.categoriaId,
      status: this.form.status
    };

    if (this.editando) {
      this.apiService.atualizarPrato(this.form.id, dto).subscribe({
        next: () => {
          this.sucesso = 'Prato atualizado com sucesso!';
          this.mostrarFormulario = false;
          this.carregarPratos();
          setTimeout(() => this.sucesso = '', 3000);
        },
        error: (err) => this.erro = err.error?.message || 'Erro ao atualizar prato.'
      });
    } else {
      this.apiService.criarPrato(dto).subscribe({
        next: () => {
          this.sucesso = 'Prato criado com sucesso!';
          this.mostrarFormulario = false;
          this.carregarPratos();
          setTimeout(() => this.sucesso = '', 3000);
        },
        error: (err) => this.erro = err.error?.message || 'Erro ao criar prato.'
      });
    }
  }

  excluir(id: number) {
    if (confirm('Deseja excluir este prato?')) {
      this.apiService.deletarPrato(id).subscribe({
        next: () => {
          this.sucesso = 'Prato excluído com sucesso!';
          this.carregarPratos();
          setTimeout(() => this.sucesso = '', 3000);
        },
        error: (err) => alert('Erro ao excluir: ' + (err.error?.message || err.message))
      });
    }
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.erro = '';
  }

  getNomeCategoria(categoriaId: number): string {
    const cat = this.categorias.find(c => c.id === categoriaId);
    return cat ? cat.nome : '-';
  }
}