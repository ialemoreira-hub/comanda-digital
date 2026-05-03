import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ItemCarrinho {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  foto_url?: string;
  observacoes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {

  private itens: ItemCarrinho[] = [];
  private itensSubject = new BehaviorSubject<ItemCarrinho[]>([]);
  itens$ = this.itensSubject.asObservable();

  private emitir() {
    this.itensSubject.next([...this.itens]);
  }

  adicionar(prato: any) {
    const item = this.itens.find(i => i.id === prato.id);
    if (item) {
      item.quantidade++;
    } else {
      this.itens.push({ ...prato, quantidade: 1 });
    }
    this.emitir();
  }

  remover(id: number) {
    this.itens = this.itens.filter(i => i.id !== id);
    this.emitir();
  }

  alterarQuantidade(id: number, quantidade: number) {
    const item = this.itens.find(i => i.id === id);
    if (item) {
      if (quantidade <= 0) {
        this.remover(id);
      } else {
        item.quantidade = quantidade;
      }
    }
    this.emitir();
  }

  getItens(): ItemCarrinho[] {
    return this.itens;
  }

  getTotal(): number {
    return this.itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  }

  getTotalItens(): number {
    return this.itens.reduce((total, item) => total + item.quantidade, 0);
  }

  limpar() {
    this.itens = [];
    this.emitir();
  }
}