import { Component, computed, inject, Signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  //currentUser=this.authService.currentUserSignal

  qtyItems =1;
  constructor(private router: Router,
    
  ) {
   /*  this.isAuntenticated = false;
    this.currentUser = {
      email: 'isw@prueba.com',
    }; */
  }
  //Solo acepta ADMIN
  // public isAdmin=computed(()=>{
  //   const user=this.authService.currentUserSignal()
  //   console.log('User: ',user?.role.toString())
  //   return user?.role.toString() =='ADMIN'
  // })
  //Solo acepta USER

  //Acepta ADMIN y USER

  ngOnInit(): void {
  }
 /*  login() {
    this.router.navigate(['usuario/login']);
  }
  logout() {
    //
    this.authService.logout();
    this.router.navigate(['inicio']);
  } */
}
