import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

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

  constructor() {
    this.bp
      .observe([Breakpoints.Handset])
      .pipe(map(r => r.matches))
      .subscribe(match => this.isHandset = match);
  }

  handleNavigate() {
    if (this.isHandset) this.opened = false;
  }
}
