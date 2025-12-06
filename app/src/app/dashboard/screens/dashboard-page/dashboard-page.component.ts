import { Component, OnInit, inject } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DashboardService } from '../../../share/services/dashboard.service';
import { NotificationsService } from '../../../share/services/notification.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  standalone: false,
})
export class DashboardPageComponent implements OnInit {

  private svc = inject(DashboardService);
  private notif = inject(NotificationsService);

  kpis: any = {};
  charts: any = {};
  alerts: any = {};

  ngOnInit() {
    this.loadKPIs();
    this.loadCharts();
    this.loadAlerts();
  }

  // =============================================================
  // =============== LOAD DATA FROM SERVICE =======================
  // =============================================================

  loadKPIs() {
    this.svc.getKPIs().subscribe((d: any) => {
      this.kpis = d;
      this.notif.agregar(`Dashboard cargó KPIs correctamente`, 'info');
    });
  }

  loadCharts() {
    this.svc.getCharts().subscribe((d: any) => {
      this.charts = d;
      this.renderCharts();
    });
  }

  loadAlerts() {
    this.svc.getAlerts().subscribe((d: any) => {
      this.alerts = d;

      if (d.inventarioCritico > 0) {
        this.notif.agregar(`${d.inventarioCritico} items en inventario crítico`, 'warning');
      }
    });
  }

  // =============================================================
  // ==================== CHART OPTIONS ==========================
  // =============================================================

  private getCommonOptions(): ChartConfiguration['options'] {
    return {
      responsive: true,
      maintainAspectRatio: false,
      devicePixelRatio: window.devicePixelRatio || 1,
      plugins: {
        tooltip: {
          backgroundColor: 'rgba(94, 44, 95, 0.9)',
          padding: 10,
          cornerRadius: 8,
          bodyFont: { family: "'Inter', sans-serif" },
          titleFont: { family: "'Inter', sans-serif" },
        },
      },
    };
  }

  private getDoughnutOptions(): ChartConfiguration<'doughnut'>['options'] {
    return {
      ...(this.getCommonOptions() as any),
      cutout: '60%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            font: { size: 11 }
          }
        }
      }
    };
  }

  private getBarOptions(): ChartConfiguration<'bar'>['options'] {
    return {
      ...(this.getCommonOptions() as any), // Agregado 'as any'
      scales: {
        y: { beginAtZero: true },
        x: {},
      },
      plugins: {
        legend: { display: false }
      }
    };
  }

  private getLineOptions(): ChartConfiguration<'line'>['options'] {
    return {
      ...(this.getCommonOptions() as any), // Agregado 'as any'
      scales: {
        y: { beginAtZero: true },
        x: {},
      }
    };
  }

  // =============================================================
  // ======================== RENDER CHARTS =======================
  // =============================================================

  renderCharts() {
    // =============================================================
    // 1. DOUGHNUT — Perfiles por Rol
    // =============================================================
    new Chart<'doughnut'>('chartRoles', {
      type: 'doughnut',
      data: {
        labels: this.charts.perfilesRol.map((x: any) => x.rol),
        datasets: [
          {
            data: this.charts.perfilesRol.map((x: any) => x._count.rol),
            backgroundColor: ['#5E2C5F', '#F4B459', '#9B59B6', '#D4AC0D'],
            borderWidth: 0
          }
        ]
      },
      options: this.getDoughnutOptions()
    });

    // =============================================================
    // 2. BAR — Actividades por Tipo
    // =============================================================
    new Chart<'bar'>('chartTipos', {
      type: 'bar',
      data: {
        labels: this.charts.actividadesTipo.map((x: any) => x.tipoActividad),
        datasets: [
          {
            label: 'Cantidad',
            data: this.charts.actividadesTipo.map((x: any) => x._count.tipoActividad),
            backgroundColor: '#5E2C5F',
            borderRadius: 4
          }
        ]
      },
      options: this.getBarOptions()
    });

    // =============================================================
    // 3. LINE — Actividades por Fecha
    // =============================================================
    new Chart<'line'>('chartFechas', {
      type: 'line',
      data: {
        labels: this.charts.actividadesFecha.map((x: any) => x.fechaActividad.slice(0, 10)),
        datasets: [
          {
            label: 'Actividades',
            data: this.charts.actividadesFecha.map((x: any) => x._count.fechaActividad),
            borderColor: '#F4B459',
            backgroundColor: 'rgba(244,180,89,0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: '#5E2C5F'
          }
        ]
      },
      options: this.getLineOptions()
    });

    // =============================================================
    // 4. BAR — Inventario ADD vs DELETE
    // =============================================================
    new Chart<'bar'>('chartMovimientos', {
      type: 'bar',
      data: {
        labels: ['ADD', 'DELETE'],
        datasets: [
          {
            label: 'Movimientos',
            data: [
              this.charts.movimientosInventario.find((x: any) => x.tipoMovimiento === 'ADD')?._count.tipoMovimiento ?? 0,
              this.charts.movimientosInventario.find((x: any) => x.tipoMovimiento === 'DELETE')?._count.tipoMovimiento ?? 0,
            ],
            backgroundColor: ['#27AE60', '#C0392B'],
            borderRadius: 4,
          }
        ]
      },
      options: this.getBarOptions()
    });
  }
}
