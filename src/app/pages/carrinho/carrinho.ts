import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CarrinhoService, ItemCarrinho } from '../../services/carrinho';
import { ApiService } from '../../services/api';

const RESTAURANTE_LAT = -23.6453;
const RESTAURANTE_LNG = -46.7805;
const RAIO_MAX_KM = 15;
const TAXA_ENTREGA = 12.00;

@Component({
  selector: 'app-carrinho',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css'
})
export class CarrinhoComponent implements OnInit {

  itens: ItemCarrinho[] = [];
  total: number = 0;

  mostrarModalEndereco = false;
  enderecoSalvo: any = null;
  usarEnderecoSalvo = true;
  endereco = { cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '' };
  erroEndereco = '';

  taxaEntrega = 0;
  foraDaArea = false;
  buscandoCep = false;

  formaPagamento = 'DINHEIRO';
  formasPagamento = [
    { valor: 'DINHEIRO', label: 'Dinheiro', aviso: 'Lembre-se de informar o valor para troco nas observações.' },
    { valor: 'MAQUININHA', label: 'Cartão na entrega', aviso: 'O entregador levará a maquininha de cartão.' },
    { valor: 'PIX', label: 'Pix na entrega', aviso: 'Você receberá a chave Pix no momento da entrega.' },
  ];
  troco = '';

  get avisoPagamento(): string {
    return this.formasPagamento.find(f => f.valor === this.formaPagamento)?.aviso || '';
  }

  get totalComEntrega(): number {
    return this.total + this.taxaEntrega;
  }

  constructor(
    private carrinhoService: CarrinhoService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.atualizar();
    const salvo = localStorage.getItem(this.getChaveEndereco());
    if (salvo) {
      this.enderecoSalvo = JSON.parse(salvo);
      this.endereco = { ...this.enderecoSalvo };
      if (this.enderecoSalvo.cep) {
        this.calcularFrete(this.enderecoSalvo.cep);
      }
    }
  }

  private getChaveEndereco(): string {
    const usuario = localStorage.getItem('usuario');
    const id = usuario ? JSON.parse(usuario).id : 'guest';
    return `endereco_entrega_${id}`;
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
  calcularFretePorCep() {
  const cep = this.endereco.cep.replace(/\D/g, '');
  if (cep.length !== 8) {
    this.erroEndereco = 'Digite um CEP válido com 8 dígitos.';
    return;
  }
  this.erroEndereco = '';
  this.calcularFrete(cep);
}

  get enderecoFormatado(): string {
    if (!this.enderecoSalvo) return '';
    const e = this.enderecoSalvo;
    return `${e.rua}, ${e.numero}${e.complemento ? ' ' + e.complemento : ''} — ${e.bairro}, ${e.cidade} — CEP: ${e.cep}`;
  }

confirmarPedido() {
  const token = localStorage.getItem('token');
  if (!token) {
    this.router.navigate(['/login'], { queryParams: { returnUrl: '/carrinho' } });
    return;
  }
  this.erroEndereco = '';
  this.formaPagamento = 'DINHEIRO';
  this.troco = '';
  this.usarEnderecoSalvo = !!this.enderecoSalvo;
  if (this.enderecoSalvo?.cep) {
    this.calcularFrete(this.enderecoSalvo.cep.replace(/\D/g, ''));
  }
  this.mostrarModalEndereco = true;
}

  fecharModal() {
    this.mostrarModalEndereco = false;
    this.erroEndereco = '';
  }

  usarNovoEndereco() {
    this.usarEnderecoSalvo = false;
    this.endereco = { cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '' };
    this.taxaEntrega = 0;
    this.foraDaArea = false;
  }

  onCepChange() {
    const cep = this.endereco.cep.replace(/\D/g, '');
    if (cep.length === 8) {
      this.buscarCep(cep);
    }
  }

  buscarCep(cep: string) {
    this.buscandoCep = true;
    this.erroEndereco = '';
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(r => r.json())
      .then(data => {
        if (data.erro) {
          this.erroEndereco = 'CEP não encontrado.';
          this.buscandoCep = false;
          return;
        }
        this.endereco.rua = data.logradouro || '';
        this.endereco.bairro = data.bairro || '';
        this.endereco.cidade = data.localidade || '';
        this.calcularFrete(cep);
        this.buscandoCep = false;
      })
      .catch(() => {
        this.erroEndereco = 'Erro ao buscar CEP.';
        this.buscandoCep = false;
      });
  }

  calcularFrete(cep: string) {
  this.buscandoCep = true;
  console.log('Calculando frete para CEP:', cep);
  
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(r => r.json())
    .then(data => {
      console.log('ViaCEP retornou:', data);
      if (data.erro) {
        this.erroEndereco = 'CEP não encontrado.';
        this.buscandoCep = false;
        return;
      }
      const uf = data.uf;
      const cidade = (data.localidade || '').toLowerCase();
      console.log('UF:', uf, '| Cidade:', cidade);

      const cidadesAtendidas = [
        'são paulo', 'osasco', 'taboão da serra', 'embu das artes',
        'cotia', 'itapevi', 'barueri', 'carapicuíba', 'santana de parnaíba',
        'jandira', 'embu-guaçu', 'vargem grande paulista'
      ];

      if (uf === 'SP' && cidadesAtendidas.some(c => cidade.includes(c))) {
        this.taxaEntrega = TAXA_ENTREGA;
        this.foraDaArea = false;
        console.log('Dentro da área! Taxa:', TAXA_ENTREGA);
      } else {
        this.taxaEntrega = 0;
        this.foraDaArea = true;
        console.log('Fora da área!');
      }
      this.buscandoCep = false;
    })
    .catch(err => {
      console.error('Erro:', err);
      this.taxaEntrega = TAXA_ENTREGA;
      this.foraDaArea = false;
      this.buscandoCep = false;
    });
}

  calcularDistanciaKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  finalizarPedido() {
    if (this.usarEnderecoSalvo && this.enderecoSalvo) {
      if (this.foraDaArea) {
        this.erroEndereco = 'Seu endereço está fora da área de entrega (máximo 15km).';
        return;
      }
      this.enviarPedido(this.enderecoFormatado);
      return;
    }
    if (!this.endereco.cep.trim()) { this.erroEndereco = 'Informe o CEP.'; return; }
    if (!this.endereco.rua.trim()) { this.erroEndereco = 'Informe a rua.'; return; }
    if (!this.endereco.numero.trim()) { this.erroEndereco = 'Informe o número.'; return; }
    if (!this.endereco.bairro.trim()) { this.erroEndereco = 'Informe o bairro.'; return; }
    if (!this.endereco.cidade.trim()) { this.erroEndereco = 'Informe a cidade.'; return; }
    if (this.foraDaArea) { this.erroEndereco = 'Seu endereço está fora da área de entrega (máximo 15km).'; return; }

    localStorage.setItem(this.getChaveEndereco(), JSON.stringify(this.endereco));
    this.enderecoSalvo = { ...this.endereco };
    this.enviarPedido(this.enderecoFormatado);
  }

  enviarPedido(enderecoEntrega: string) {
    const obs = this.formaPagamento === 'DINHEIRO' && this.troco
      ? `Pagamento: Dinheiro. Troco para R$ ${this.troco}.`
      : `Pagamento: ${this.formaPagamento === 'MAQUININHA' ? 'Cartão na entrega' : 'Pix na entrega'}.`;

    const pedidoRequest = {
      enderecoEntrega,
      observacoes: obs,
      itens: this.itens.map(i => ({
        pratoId: i.id,
        quantidade: i.quantidade,
        observacoes: i.observacoes ?? ''
      }))
    };

    this.apiService.criarPedido(pedidoRequest).subscribe({
      next: (pedido) => {
        localStorage.setItem('ultimo_pedido', JSON.stringify(pedido));
        this.carrinhoService.limpar();
        this.mostrarModalEndereco = false;
        this.router.navigate(['/pedido-confirmado']);
      },
      error: (err) => {
        if (err.status === 422) {
          this.erroEndereco = err.error?.message || 'Estoque insuficiente para um dos itens.';
        } else {
          this.erroEndereco = 'Erro ao criar pedido. Tente novamente.';
        }
      }
    });
  }
}