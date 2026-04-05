import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
  }

  // Auth
  login(email: string, senha: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { email, senha });
  }

  register(nome: string, email: string, senha: string, telefone: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, { nome, email, senha, telefone });
  }

  // Cardápio
  getCardapio(categoriaId?: number): Observable<any[]> {
    const url = categoriaId
      ? `${this.baseUrl}/cardapio?categoriaId=${categoriaId}`
      : `${this.baseUrl}/cardapio`;
    return this.http.get<any[]>(url);
  }

  getPrato(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/cardapio/${id}`);
  }

  // Categorias
  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/categorias`, { headers: this.getHeaders() });
  }

  criarCategoria(dto: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/categorias`, dto, { headers: this.getHeaders() });
  }

  atualizarCategoria(id: number, dto: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/categorias/${id}`, dto, { headers: this.getHeaders() });
  }

  deletarCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/categorias/${id}`, { headers: this.getHeaders() });
  }

  // Pratos Admin
  getPratosAdmin(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/pratos?page=${page}&size=${size}`, { headers: this.getHeaders() });
  }

  criarPrato(dto: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/pratos`, dto, { headers: this.getHeaders() });
  }

  atualizarPrato(id: number, dto: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/pratos/${id}`, dto, { headers: this.getHeaders() });
  }

  deletarPrato(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/pratos/${id}`, { headers: this.getHeaders() });
  }

  // Fornecedores
  getFornecedores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/fornecedores`, { headers: this.getHeaders() });
  }

  criarFornecedor(dto: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/fornecedores`, dto, { headers: this.getHeaders() });
  }

  atualizarFornecedor(id: number, dto: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/fornecedores/${id}`, dto, { headers: this.getHeaders() });
  }

  deletarFornecedor(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/fornecedores/${id}`, { headers: this.getHeaders() });
  }
}