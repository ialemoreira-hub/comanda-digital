import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../../services/api';

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
  carregando = false;

  constructor(private router: Router, private apiService: ApiService) {}

  login() {
    if (!this.email || !this.senha) {
      this.erro = 'Preencha todos os campos!';
      return;
    }

    this.carregando = true;
    this.erro = '';

    this.apiService.login(this.email, this.senha).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('usuario', JSON.stringify({
          nome: response.nome,
          email: response.email,
          perfil: response.perfil
        }));
        this.carregando = false;
        if (response.perfil === 'ADMIN' || response.perfil === 'GERENTE') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/cardapio']);
        }
      },
      error: (err) => {
        this.erro = err.error?.erro || 'Email ou senha inválidos!';
        this.carregando = false;
      }
    });
  }
}