import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  ordem: number;
  status: string;
}

@Component({
  selector: 'app-categorias',
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class CategoriasComponent {

  mostrarFormulario = false;
  editando = false;
  erro = '';
  sucesso = '';

  categorias: Categoria[] = [
    { id: 1, nome: 'Entradas', descricao: 'Petiscos e entradas', ordem: 1, status: 'ATIVO' },
    { id: 2, nome: 'Pratos Principais', descricao: 'Pratos principais do cardápio', ordem: 2, status: 'ATIVO' },
    { id: 3, nome: 'Sobremesas', descricao: 'Doces e sobremesas', ordem: 3, status: 'ATIVO' },
    { id: 4, nome: 'Bebidas', descricao: 'Bebidas diversas', ordem: 4, status: 'ATIVO' },
  ];

  form: Categoria = { id: 0, nome: '', descricao: '', ordem: 0, status: 'ATIVO' };

  abrirFormulario() {
    this.form = { id: 0, nome: '', descricao: '', ordem: 0, status: 'ATIVO' };
    this.editando = false;
    this.mostrarFormulario = true;
  }

  editar(categoria: Categoria) {
    this.form = { ...categoria };
    this.editando = true;
    this.mostrarFormulario = true;
  }

  salvar() {
    if (!this.form.nome) {
      this.erro = 'Nome é obrigatório!';
      return;
    }

    if (this.editando) {
      const index = this.categorias.findIndex(c => c.id === this.form.id);
      this.categorias[index] = { ...this.form };
      this.sucesso = 'Categoria atualizada com sucesso!';
    } else {
      this.form.id = this.categorias.length + 1;
      this.categorias.push({ ...this.form });
      this.sucesso = 'Categoria criada com sucesso!';
    }

    this.erro = '';
    this.mostrarFormulario = false;
    setTimeout(() => this.sucesso = '', 3000);
  }

  excluir(id: number) {
    if (confirm('Deseja excluir esta categoria?')) {
      this.categorias = this.categorias.filter(c => c.id !== id);
    }
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.erro = '';
  }
}