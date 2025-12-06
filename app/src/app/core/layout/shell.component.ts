import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  standalone: false
})
export class ShellComponent {
  private bp = inject(BreakpointObserver);

  isHandset = false;
  opened = true;

  constructor(private router: Router) {
    this.bp
      .observe([Breakpoints.Handset])
      .pipe(map(r => r.matches))
      .subscribe(match => this.isHandset = match);
  }

  handleNavigate() {
    if (this.isHandset) this.opened = false;
  }

  isLoginPage(): boolean {
    return this.router.url.includes('/user-login');
  }
}
