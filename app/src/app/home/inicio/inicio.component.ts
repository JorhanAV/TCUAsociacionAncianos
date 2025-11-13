import { Component, signal } from '@angular/core';

interface Cliente {
  nombre: string;
  email: string;
  tel: string;
  avatar?: string;
  initials?: string;
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss',
  standalone: false
})
export class InicioComponent {
  clientes = signal<Cliente[]>([
    { nombre:'Jose Soto',   email:'soto.2808@gmail.com',  tel:'88428181', avatar:'https://i.pravatar.cc/80?img=1' },
    { nombre:'tony soto',   email:'tony.2808@hotmail.com',tel:'88428181', initials:'TS' },
    { nombre:'Diana Zumbado', email:'dianazumbado01@gmail.com', tel:'83822665', initials:'DZ' },
    { nombre:'Caleb Villalta', email:'calebvllga@gmail.com', tel:'88736233', avatar:'https://i.pravatar.cc/80?img=2' },
  ]);
}
