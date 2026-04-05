import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../../services/api';

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
  carregando = false;

  constructor(private router: Router, private apiService: ApiService) {}

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

    this.carregando = true;
    this.erro = '';

    this.apiService.register(this.nome, this.email, this.senha, this.telefone).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('usuario', JSON.stringify({
          nome: response.nome,
          email: response.email,
          perfil: response.perfil
        }));
        this.sucesso = 'Conta criada com sucesso! Redirecionando...';
        this.carregando = false;
        setTimeout(() => {
          this.router.navigate(['/cardapio']);
        }, 2000);
      },
      error: (err) => {
        this.erro = err.error?.erro || 'Erro ao criar conta!';
        this.carregando = false;
      }
    });
  }
}