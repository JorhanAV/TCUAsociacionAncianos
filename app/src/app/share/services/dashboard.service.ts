import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private api = 'http://localhost:3000/dashboard';

  constructor(private http: HttpClient) {}

  getKPIs()     { return this.http.get(`${this.api}/kpis`); }
  getCharts()   { return this.http.get(`${this.api}/charts`); }
  getAlerts()   { return this.http.get(`${this.api}/alerts`); }
}