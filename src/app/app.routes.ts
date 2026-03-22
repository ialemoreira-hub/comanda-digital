import { Routes } from '@angular/router';
import { CardapioComponent } from './pages/cardapio/cardapio';
import { CarrinhoComponent } from './pages/carrinho/carrinho';
import { LoginComponent } from './pages/login/login';
import { CadastroComponent } from './pages/cadastro/cadastro';
import { PedidoConfirmadoComponent } from './pages/pedido-confirmado/pedido-confirmado';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout';
import { DashboardComponent } from './pages/admin/dashboard/dashboard';
import { PratosComponent } from './pages/admin/pratos/pratos';
import { CategoriasComponent } from './pages/admin/categorias/categorias';

export const routes: Routes = [
  { path: '', redirectTo: 'cardapio', pathMatch: 'full' },
  { path: 'cardapio', component: CardapioComponent },
  { path: 'carrinho', component: CarrinhoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'pedido-confirmado', component: PedidoConfirmadoComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'pratos', component: PratosComponent },
      { path: 'categorias', component: CategoriasComponent },
    ]
  },
];