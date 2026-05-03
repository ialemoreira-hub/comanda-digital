import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('graficoTopPratos') graficoTopPratosRef!: ElementRef;
  @ViewChild('graficoPedidos') graficoPedidosRef!: ElementRef;

  resumo: any = {};
  topPratos: any[] = [];
  alertasEstoque: any[] = [];
  pedidosRecentes: any[] = [];
  carregando = true;

  private chartTopPratos: Chart | null = null;
  private chartPedidos: Chart | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.carregarDados();
  }

  ngAfterViewInit() {}

  carregarDados() {
    this.apiService.getDashboardResumo().subscribe({
      next: (data) => this.resumo = data,
      error: () => {}
    });

    this.apiService.getDashboardTopPratos().subscribe({
      next: (data) => {
        this.topPratos = data;
        setTimeout(() => this.criarGraficoTopPratos(), 100);
      },
      error: () => {}
    });

    this.apiService.getDashboardAlertasEstoque().subscribe({
      next: (data) => this.alertasEstoque = data,
      error: () => {}
    });

    this.apiService.listarTodosPedidos().subscribe({
      next: (data) => {
        this.pedidosRecentes = data
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 4);
        this.carregando = false;
        setTimeout(() => this.criarGraficoPedidos(), 100);
      },
      error: () => this.carregando = false
    });
  }

  criarGraficoTopPratos() {
    if (!this.graficoTopPratosRef || this.topPratos.length === 0) return;
    if (this.chartTopPratos) this.chartTopPratos.destroy();

    const ctx = this.graficoTopPratosRef.nativeElement.getContext('2d');
    this.chartTopPratos = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.topPratos.map(p => p.nome),
        datasets: [{
          label: 'Vendidos',
          data: this.topPratos.map(p => p.quantidade),
          backgroundColor: [
            '#c0392b', '#e74c3c', '#e67e22', '#f39c12', '#d35400'
          ],
          borderRadius: 8,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    });
  }

  criarGraficoPedidos() {
    if (!this.graficoPedidosRef) return;
    if (this.chartPedidos) this.chartPedidos.destroy();

    const statusCount: any = {
      'RECEBIDO': 0, 'CONFIRMADO': 0, 'EM_PREPARO': 0,
      'PRONTO': 0, 'FINALIZADO': 0, 'CANCELADO': 0
    };

    this.pedidosRecentes.forEach((p: any) => {
      if (statusCount[p.status] !== undefined) statusCount[p.status]++;
    });

    const ctx = this.graficoPedidosRef.nativeElement.getContext('2d');
    this.chartPedidos = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(statusCount),
        datasets: [{
          data: Object.values(statusCount),
          backgroundColor: [
            '#3498db', '#2ecc71', '#e67e22', '#9b59b6', '#27ae60', '#e74c3c'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}