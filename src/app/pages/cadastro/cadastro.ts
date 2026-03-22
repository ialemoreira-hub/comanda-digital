import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})
export class CadastroComponent {

  nome = '';
  email = '';
  telefone = '';
  senha = '';
  confirmarSenha = '';
  erro = '';
  sucesso = '';

  constructor(private router: Router) {}

  cadastrar() {
    if (!this.nome || !this.email || !this.senha || !this.confirmarSenha) {
      this.erro = 'Preencha todos os campos obrigatórios!';
      return;
    }

    if (!this.email.includes('@')) {
      this.erro = 'Email inválido!';
      return;
    }

    if (this.senha.length < 6) {
      this.erro = 'A senha deve ter no mínimo 6 caracteres!';
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      this.erro = 'As senhas não coincidem!';
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    usuarios.push({ nome: this.nome, email: this.email, senha: this.senha, perfil: 'CLIENTE' });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    this.erro = '';
    this.sucesso = 'Conta criada com sucesso! Redirecionando...';

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }
}