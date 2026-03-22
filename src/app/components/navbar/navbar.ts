import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {

  usuario: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.verificarLogin();
    
    // Atualiza navbar toda vez que mudar de página
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.verificarLogin();
      }
    });
  }

  verificarLogin() {
    const dados = localStorage.getItem('usuario');
    if (dados) {
      this.usuario = JSON.parse(dados);
    } else {
      this.usuario = null;
    }
  }

  logout() {
    localStorage.removeItem('usuario');
    this.usuario = null;
    this.router.navigate(['/cardapio']);
  }

  isAdmin() {
    return this.usuario?.perfil === 'ADMIN' || this.usuario?.perfil === 'GERENTE';
  }
}