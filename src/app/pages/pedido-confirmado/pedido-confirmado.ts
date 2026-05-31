import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pedido-confirmado',
  imports: [RouterLink],
  templateUrl: './pedido-confirmado.html',
  styleUrl: './pedido-confirmado.css'
})
export class PedidoConfirmadoComponent implements OnInit {

  numeroPedido: number = 0;

  ngOnInit() {
    const pedido = localStorage.getItem('ultimo_pedido');
    if (pedido) {
      this.numeroPedido = JSON.parse(pedido).id;
    }
  }
}