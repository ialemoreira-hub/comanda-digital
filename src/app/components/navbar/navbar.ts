import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CarrinhoService } from '../../services/carrinho';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit, OnDestroy {

  usuario: any = null;
  menuAberto = false;
  totalItensCarrinho = 0;
  private sub: Subscription = new Subscription();

  constructor(private router: Router, private carrinhoService: CarrinhoService) {}

  ngOnInit() {
    this.verificarLogin();

    this.sub.add(
      this.router.events
        .pipe(filter(e => e instanceof NavigationEnd))
        .subscribe(() => {
          this.verificarLogin();
          this.menuAberto = false;
        })
    );

    this.sub.add(
      this.carrinhoService.itens$.subscribe(itens => {
        this.totalItensCarrinho = itens.reduce((acc, i) => acc + i.quantidade, 0);
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  verificarLogin() {
    const dados = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');
    if (dados && token) {
      this.usuario = JSON.parse(dados);
    } else {
      this.usuario = null;
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
    }
  }

 logout() {
  localStorage.removeItem('usuario');
  localStorage.removeItem('token');
  this.carrinhoService.limpar();
  this.usuario = null;
  this.menuAberto = false;
  this.router.navigate(['/cardapio']);
}

  isAdmin() {
    return this.usuario?.perfil === 'ADMIN' || this.usuario?.perfil === 'GERENTE';
  }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }
}