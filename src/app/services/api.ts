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
  // Pedidos - Cliente
  criarPedido(pedido: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/pedidos`, pedido, { headers: this.getHeaders() });
  }

  meusPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pedidos/meus`, { headers: this.getHeaders() });
  }

  statusPedido(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/pedidos/${id}/status`, { headers: this.getHeaders() });
  }

  // Pedidos - Admin
  listarTodosPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/pedidos`, { headers: this.getHeaders() });
  }

  atualizarStatusPedido(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/admin/pedidos/${id}/status`, { status }, { headers: this.getHeaders() });
  }

  cancelarPedido(id: number, motivo: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/admin/pedidos/${id}/cancelar`, { motivo }, { headers: this.getHeaders() });
  }
  // Dashboard
  getDashboardResumo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/dashboard/resumo`, { headers: this.getHeaders() });
  }

  getDashboardTopPratos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/dashboard/top-pratos`, { headers: this.getHeaders() });
  }

  getDashboardAlertasEstoque(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/dashboard/alertas-estoque`, { headers: this.getHeaders() });
  }
  // Estoque
  getEstoqueSaldo(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/estoque/saldo`, { headers: this.getHeaders() });
  }

  getEstoqueAlertas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/estoque/alertas`, { headers: this.getHeaders() });
  }

  getEstoqueMovimentacoes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/estoque/movimentacoes`, { headers: this.getHeaders() });
  }

  registrarSaidaEstoque(body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/estoque/movimentacao`, body, { headers: this.getHeaders() });
  }
  // Compras
  getCompras(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/compras`, { headers: this.getHeaders() });
  }

  criarCompra(body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/compras`, body, { headers: this.getHeaders() });
  }

  receberCompra(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/admin/compras/${id}/receber`, {}, { headers: this.getHeaders() });
  }

  atualizarStatusCompra(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/admin/compras/${id}/status`, { status }, { headers: this.getHeaders() });
  }
  // Feedback do cliente
  confirmarRecebimento(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/pedidos/${id}/confirmar-recebimento`, {}, { headers: this.getHeaders() });
  }

  enviarFeedback(id: number, feedback: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/pedidos/${id}/feedback`, { feedback }, { headers: this.getHeaders() });
  }
}