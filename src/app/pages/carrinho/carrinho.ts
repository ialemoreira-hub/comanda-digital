import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CarrinhoService, ItemCarrinho } from '../../services/carrinho';

@Component({
  selector: 'app-carrinho',
  imports: [CommonModule, RouterLink],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css'
})
export class CarrinhoComponent implements OnInit {

  itens: ItemCarrinho[] = [];
  total: number = 0;

  constructor(private carrinhoService: CarrinhoService, private router: Router) {}

  ngOnInit() {
    this.atualizar();
  }

  atualizar() {
    this.itens = this.carrinhoService.getItens();
    this.total = this.carrinhoService.getTotal();
  }

  aumentar(item: ItemCarrinho) {
    this.carrinhoService.alterarQuantidade(item.id, item.quantidade + 1);
    this.atualizar();
  }

  diminuir(item: ItemCarrinho) {
    this.carrinhoService.alterarQuantidade(item.id, item.quantidade - 1);
    this.atualizar();
  }

  remover(id: number) {
    this.carrinhoService.remover(id);
    this.atualizar();
  }

  limpar() {
    this.carrinhoService.limpar();
    this.atualizar();
  }

  confirmarPedido() {
    this.router.navigate(['/pedido-confirmado']);
  }
}