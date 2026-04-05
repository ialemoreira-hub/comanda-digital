import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarrinhoService } from '../../services/carrinho';
import { ApiService } from '../../services/api';

interface Prato {
  id: number;
  nome: string;
  descricao: string;
  precoVenda: number;
  fotoUrl: string;
  categoria: string;
  categoriaNome: string;
}

@Component({
  selector: 'app-cardapio',
  imports: [CommonModule],
  templateUrl: './cardapio.html',
  styleUrl: './cardapio.css'
})
export class CardapioComponent implements OnInit {

  categorias: string[] = ['Todos'];
  categoriaSelecionada = 'Todos';
  pratos: Prato[] = [];
  pratosFiltrados: Prato[] = [];
  carregando = true;

  constructor(
    private carrinhoService: CarrinhoService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.apiService.getCardapio().subscribe({
      next: (pratos) => {
        this.pratos = pratos;
        this.pratosFiltrados = pratos;
        const cats = ['Todos', ...new Set(pratos.map((p: any) => p.categoriaNome))];
        this.categorias = cats;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar cardápio', err);
        this.carregando = false;
      }
    });
  }

  filtrar(categoria: string) {
    this.categoriaSelecionada = categoria;
    if (categoria === 'Todos') {
      this.pratosFiltrados = this.pratos;
    } else {
      this.pratosFiltrados = this.pratos.filter(p => p.categoriaNome === categoria);
    }
  }

  adicionarAoCarrinho(prato: any) {
    this.carrinhoService.adicionar({
      id: prato.id,
      nome: prato.nome,
      preco: prato.precoVenda,
      emoji: '🍽️',
      quantidade: 1
    });
    alert(`${prato.nome} adicionado ao carrinho! 🛒`);
  }
}