// core/core.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../share/material.module';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ShellComponent } from './layout/shell.component';

@NgModule({
  declarations: [HeaderComponent, SidenavComponent, ShellComponent],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [HeaderComponent, SidenavComponent, ShellComponent]
})
export class CoreModule {}
