import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarrinhoService } from '../../services/carrinho';

interface Prato {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  emoji: string;
  categoria: string;
}

@Component({
  selector: 'app-cardapio',
  imports: [CommonModule],
  templateUrl: './cardapio.html',
  styleUrl: './cardapio.css'
})
export class CardapioComponent {

  categorias = ['Todos', 'Entradas', 'Pratos Principais', 'Sobremesas', 'Bebidas'];
  categoriaSelecionada = 'Todos';

  pratos: Prato[] = [
    { id: 1, nome: 'Bruschetta', descricao: 'Pão tostado com tomate e manjericão', preco: 18.90, emoji: '🥖', categoria: 'Entradas' },
    { id: 2, nome: 'Bolinho de Bacalhau', descricao: 'Tradicional bolinho crocante', preco: 24.90, emoji: '🐟', categoria: 'Entradas' },
    { id: 3, nome: 'Frango Grelhado', descricao: 'Frango grelhado com legumes', preco: 42.90, emoji: '🍗', categoria: 'Pratos Principais' },
    { id: 4, nome: 'Picanha na Brasa', descricao: 'Picanha com arroz e farofa', preco: 89.90, emoji: '🥩', categoria: 'Pratos Principais' },
    { id: 5, nome: 'Massa ao Molho', descricao: 'Espaguete ao molho bolonhesa', preco: 38.90, emoji: '🍝', categoria: 'Pratos Principais' },
    { id: 6, nome: 'Pudim', descricao: 'Pudim de leite condensado', preco: 16.90, emoji: '🍮', categoria: 'Sobremesas' },
    { id: 7, nome: 'Petit Gateau', descricao: 'Bolinho quente com sorvete', preco: 22.90, emoji: '🍫', categoria: 'Sobremesas' },
    { id: 8, nome: 'Suco Natural', descricao: 'Laranja, limão ou maracujá', preco: 12.90, emoji: '🥤', categoria: 'Bebidas' },
    { id: 9, nome: 'Refrigerante', descricao: 'Lata 350ml', preco: 8.90, emoji: '🥫', categoria: 'Bebidas' },
  ];

  get pratosFiltrados(): Prato[] {
    if (this.categoriaSelecionada === 'Todos') return this.pratos;
    return this.pratos.filter(p => p.categoria === this.categoriaSelecionada);
  }

  constructor(private carrinhoService: CarrinhoService) {}

  filtrar(categoria: string) {
    this.categoriaSelecionada = categoria;
  }

  adicionarAoCarrinho(prato: Prato) {
    this.carrinhoService.adicionar(prato);
    alert(`${prato.nome} adicionado ao carrinho! 🛒`);
  }
}