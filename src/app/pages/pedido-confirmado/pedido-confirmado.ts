import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarrinhoService } from '../../services/carrinho';

@Component({
  selector: 'app-pedido-confirmado',
  imports: [RouterLink],
  templateUrl: './pedido-confirmado.html',
  styleUrl: './pedido-confirmado.css'
})
export class PedidoConfirmadoComponent implements OnInit {

  numeroPedido = Math.floor(Math.random() * 9000) + 1000;

  constructor(private carrinhoService: CarrinhoService) {}

  ngOnInit() {
    this.carrinhoService.limpar();
  }
}