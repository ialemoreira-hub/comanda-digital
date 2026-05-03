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

  formatarTelefone(valor: string): string {
    const nums = valor.replace(/\D/g, '').slice(0, 11);
    if (nums.length <= 2) return nums;
    if (nums.length <= 7) return `(${nums.slice(0,2)}) ${nums.slice(2)}`;
    if (nums.length <= 11) return `(${nums.slice(0,2)}) ${nums.slice(2,7)}-${nums.slice(7)}`;
    return valor;
  }

  onTelefoneInput(event: any) {
    this.telefone = this.formatarTelefone(event.target.value);
    event.target.value = this.telefone;
  }

  cadastrar() {
    if (!this.nome.trim() || !this.email.trim() || !this.senha || !this.confirmarSenha) {
      this.erro = 'Preencha todos os campos obrigatórios!';
      return;
    }

    if (this.nome.trim().length < 3) {
      this.erro = 'Nome deve ter no mínimo 3 caracteres!';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.erro = 'Email inválido!';
      return;
    }

    const telefoneLimpo = this.telefone.replace(/\D/g, '');
    if (this.telefone && telefoneLimpo.length < 10) {
      this.erro = 'Telefone inválido! Use o formato (11) 99999-9999';
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