import { Injectable } from '@angular/core';

export interface ItemCarrinho {
  id: number;
  nome: string;
  preco: number;
  emoji: string;
  quantidade: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {

  private itens: ItemCarrinho[] = [];

  adicionar(prato: any) {
    const item = this.itens.find(i => i.id === prato.id);
    if (item) {
      item.quantidade++;
    } else {
      this.itens.push({ ...prato, quantidade: 1 });
    }
  }

  remover(id: number) {
    this.itens = this.itens.filter(i => i.id !== id);
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
  }
}