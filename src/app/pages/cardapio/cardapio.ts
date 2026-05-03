import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CarrinhoService } from '../../services/carrinho';
import { ApiService } from '../../services/api';

interface Prato {
  id: number;
  nome: string;
  descricao: string;
  precoVenda: number;
  fotoUrl?: string;
  tempoPreparo?: number;
  categoria: string;
  categoriaId: number;
  categoriaNome: string;
  ativo?: boolean;
}

interface GrupoPratos {
  categoriaNome: string;
  pratos: Prato[];
}

@Component({
  selector: 'app-cardapio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cardapio.html',
  styleUrl: './cardapio.css'
})
export class CardapioComponent implements OnInit, OnDestroy {

  pratos: Prato[] = [];
  pratosFiltrados: Prato[] = [];
  gruposFiltrados: GrupoPratos[] = [];
  categorias: { nome: string; total: number }[] = [];

  categoriaSelecionada: string = 'todos';
  tituloSecao = 'Todos os pratos';
  totalPratos = 0;

  loading = false;
  erro = false;

  adicionadoId: number | null = null;

  get totalItensCarrinho(): number {
    return this.carrinhoService.getTotalItens();
  }

  get totalCarrinho(): number {
    return this.carrinhoService.getTotal();
  }

  private destroy$ = new Subject<void>();

  constructor(
    private carrinhoService: CarrinhoService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarCardapio();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  carregarCardapio(): void {
    this.loading = true;
    this.erro = false;

    this.apiService.getCardapio()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pratos: Prato[]) => {
          this.pratos = pratos;
          this.construirCategorias();
          this.filtrarCategoria('todos');
          this.loading = false;
        },
        error: () => {
          this.erro = true;
          this.loading = false;
        }
      });
  }

  private construirCategorias(): void {
    const mapa = new Map<string, number>();
    this.pratos.forEach(p => {
      const nome = p.categoriaNome;
      mapa.set(nome, (mapa.get(nome) ?? 0) + 1);
    });
    this.categorias = Array.from(mapa.entries()).map(([nome, total]) => ({ nome, total }));
    this.totalPratos = this.pratos.length;
  }

  filtrarCategoria(cat: string): void {
    this.categoriaSelecionada = cat;
    if (cat === 'todos') {
      this.pratosFiltrados = [...this.pratos];
      this.tituloSecao = 'Todos os pratos';
    } else {
      this.pratosFiltrados = this.pratos.filter(p => p.categoriaNome === cat);
      this.tituloSecao = cat;
    }
    this.construirGrupos();
  }

  private construirGrupos(): void {
    const mapa = new Map<string, GrupoPratos>();
    this.pratosFiltrados.forEach(p => {
      if (!mapa.has(p.categoriaNome)) {
        mapa.set(p.categoriaNome, { categoriaNome: p.categoriaNome, pratos: [] });
      }
      mapa.get(p.categoriaNome)!.pratos.push(p);
    });
    this.gruposFiltrados = Array.from(mapa.values());
  }

  adicionarAoCarrinho(event: MouseEvent, prato: Prato): void {
    event.stopPropagation();
    this.carrinhoService.adicionar({
      id: prato.id,
      nome: prato.nome,
      preco: prato.precoVenda,
      emoji: '🍽️',
      quantidade: 1
    });
    this.adicionadoId = prato.id;
    setTimeout(() => {
      if (this.adicionadoId === prato.id) this.adicionadoId = null;
    }, 800);
  }

  abrirDetalhe(prato: Prato): void {
    if (prato.ativo === false) return;
    this.adicionarAoCarrinho(new MouseEvent('click'), prato);
  }

  irParaCarrinho(): void {
    this.router.navigate(['/carrinho']);
  }
}