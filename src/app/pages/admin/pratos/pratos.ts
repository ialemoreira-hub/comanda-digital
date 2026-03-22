import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Prato {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  emoji: string;
  categoria: string;
  status: string;
  tempoPreparo: number;
}

@Component({
  selector: 'app-pratos',
  imports: [CommonModule, FormsModule],
  templateUrl: './pratos.html',
  styleUrl: './pratos.css'
})
export class PratosComponent {

  mostrarFormulario = false;
  editando = false;
  erro = '';
  sucesso = '';

  categorias = ['Entradas', 'Pratos Principais', 'Sobremesas', 'Bebidas'];

  pratos: Prato[] = [
    { id: 1, nome: 'Bruschetta', descricao: 'Pão tostado com tomate', preco: 18.90, emoji: '🥖', categoria: 'Entradas', status: 'ATIVO', tempoPreparo: 10 },
    { id: 2, nome: 'Frango Grelhado', descricao: 'Frango com legumes', preco: 42.90, emoji: '🍗', categoria: 'Pratos Principais', status: 'ATIVO', tempoPreparo: 25 },
    { id: 3, nome: 'Pudim', descricao: 'Pudim de leite condensado', preco: 16.90, emoji: '🍮', categoria: 'Sobremesas', status: 'ATIVO', tempoPreparo: 5 },
    { id: 4, nome: 'Suco Natural', descricao: 'Suco de fruta natural', preco: 12.90, emoji: '🥤', categoria: 'Bebidas', status: 'ATIVO', tempoPreparo: 5 },
  ];

  form: Prato = { id: 0, nome: '', descricao: '', preco: 0, emoji: '', categoria: '', status: 'ATIVO', tempoPreparo: 0 };

  abrirFormulario() {
    this.form = { id: 0, nome: '', descricao: '', preco: 0, emoji: '', categoria: '', status: 'ATIVO', tempoPreparo: 0 };
    this.editando = false;
    this.mostrarFormulario = true;
  }

  editar(prato: Prato) {
    this.form = { ...prato };
    this.editando = true;
    this.mostrarFormulario = true;
  }

  salvar() {
    if (!this.form.nome || !this.form.categoria || this.form.preco <= 0) {
      this.erro = 'Preencha todos os campos obrigatórios!';
      return;
    }

    if (this.editando) {
      const index = this.pratos.findIndex(p => p.id === this.form.id);
      this.pratos[index] = { ...this.form };
      this.sucesso = 'Prato atualizado com sucesso!';
    } else {
      this.form.id = this.pratos.length + 1;
      this.pratos.push({ ...this.form });
      this.sucesso = 'Prato criado com sucesso!';
    }

    this.erro = '';
    this.mostrarFormulario = false;
    setTimeout(() => this.sucesso = '', 3000);
  }

  excluir(id: number) {
    if (confirm('Deseja excluir este prato?')) {
      this.pratos = this.pratos.filter(p => p.id !== id);
    }
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.erro = '';
  }
}