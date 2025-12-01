import { Component, OnInit, inject } from '@angular/core';
import { DashboardService } from '../../share/services/dashboard.service';
import { NotificationsService } from '../../share/services/notification.service';
import { Chart, registerables, ChartConfiguration } from 'chart.js';

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

  // Opciones comunes para nitidez y responsive
  private commonOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false, // CRÍTICO: Permite que el gráfico llene la altura del contenedor
    devicePixelRatio: window.devicePixelRatio || 1, // Asegura nitidez en pantallas retina/móviles
    plugins: {
      legend: {
        labels: {
          font: { family: "'Inter', sans-serif", size: 11 },
          usePointStyle: true, // Puntos en vez de rectángulos en la leyenda
        }
      },
      tooltip: {
        backgroundColor: 'rgba(94, 44, 95, 0.9)', // Color morado del tema
        titleFont: { family: "'Inter', sans-serif" },
        bodyFont: { family: "'Inter', sans-serif" },
        padding: 10,
        cornerRadius: 8,
      }
    }
  };

  ngOnInit() {
    this.loadKPIs();
    this.loadCharts();
    this.loadAlerts();
  }

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

  renderCharts() {
    // 1. Pie — Perfiles por rol
    new Chart('chartRoles', {
      type: 'doughnut', // 'doughnut' se ve más moderno que 'pie'
      data: {
        labels: this.charts.perfilesRol.map((x: any) => x.rol),
        datasets: [{
          data: this.charts.perfilesRol.map((x: any) => x._count.rol),
          backgroundColor: ['#5E2C5F', '#F4B459', '#9B59B6', '#D4AC0D'],
          borderWidth: 0,
          hoverOffset: 4
        }],
      },
      options: {
        ...this.commonOptions,
        cutout: '60%', // Hace el anillo más fino
        plugins: {
          ...this.commonOptions!.plugins,
          legend: {
            position: 'right', // Leyenda a la derecha para dar más espacio vertical al gráfico
            labels: { boxWidth: 10, usePointStyle: true, font: { size: 11 } }
          }
        }
      }
    });

    // 2. Barra — Actividades por tipo
    new Chart('chartTipos', {
      type: 'bar',
      data: {
        labels: this.charts.actividadesTipo.map((x: any) => x.tipoActividad),
        datasets: [{
          label: 'Cantidad',
          data: this.charts.actividadesTipo.map((x: any) => x._count.tipoActividad),
          backgroundColor: '#5E2C5F',
          borderRadius: 4, // Bordes redondeados en las barras
        }],
      },
      options: {
        ...this.commonOptions,
        scales: {
          y: { beginAtZero: true, grid: { color: '#f0f0f0' } },
          x: { grid: { display: false } }
        }
      }
    });

    // 3. Línea — Tendencia Histórica
    new Chart('chartFechas', {
      type: 'line',
      data: {
        labels: this.charts.actividadesFecha.map((x: any) => x.fechaActividad.slice(0, 10)),
        datasets: [{
          label: 'Actividades',
          data: this.charts.actividadesFecha.map((x: any) => x._count.fechaActividad),
          borderColor: '#F4B459', // Color dorado para la línea
          backgroundColor: 'rgba(244, 180, 89, 0.1)',
          fill: true, // Relleno suave bajo la línea
          tension: 0.4, // Curvas más suaves
          pointRadius: 4,
          pointBackgroundColor: '#5E2C5F',
          borderWidth: 2
        }],
      },
      options: {
        ...this.commonOptions,
        scales: {
          y: { beginAtZero: true, grid: { color: '#f0f0f0' } },
          x: { grid: { display: false } }
        }
      }
    });

    // 4. Inventario ADD vs DELETE
    new Chart('chartMovimientos', {
      type: 'bar',
      data: {
        labels: ['Altas (ADD)', 'Bajas (DELETE)'],
        datasets: [{
          label: 'Movimientos',
          data: [
            this.charts.movimientosInventario.find((x: any) => x.tipoMovimiento === 'ADD')?._count.tipoMovimiento ?? 0,
            this.charts.movimientosInventario.find((x: any) => x.tipoMovimiento === 'DELETE')?._count.tipoMovimiento ?? 0,
          ],
          backgroundColor: ['#27AE60', '#C0392B'], // Verde y Rojo más profesionales
          borderRadius: 4,
          barPercentage: 0.6 // Barras un poco más delgadas
        }],
      },
      options: {
        ...this.commonOptions,
        plugins: {
          legend: { display: false } // No hace falta leyenda si las etiquetas del eje X son claras
        },
        scales: {
          y: { beginAtZero: true, grid: { color: '#f0f0f0' } },
          x: { grid: { display: false } }
        }
      }
    });
  }
}