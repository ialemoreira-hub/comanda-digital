import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  email = '';
  senha = '';
  erro = '';

  constructor(private router: Router) {}

  login() {
    if (!this.email || !this.senha) {
      this.erro = 'Preencha todos os campos!';
      return;
    }

    // Admin fixo
    if (this.email === 'admin@email.com' && this.senha === 'senha123') {
      localStorage.setItem('usuario', JSON.stringify({ nome: 'Admin', perfil: 'ADMIN', email: this.email }));
      this.router.navigate(['/admin/dashboard']);
      return;
    }

    // Busca usuário cadastrado no localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find((u: any) => u.email === this.email && u.senha === this.senha);

    if (usuario) {
      localStorage.setItem('usuario', JSON.stringify({ nome: usuario.nome, perfil: 'CLIENTE', email: usuario.email }));
      this.router.navigate(['/cardapio']);
      return;
    }

    this.erro = 'Email ou senha inválidos!';
  }
}