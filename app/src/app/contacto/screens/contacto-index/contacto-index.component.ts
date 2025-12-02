import { Component, signal } from '@angular/core';

interface DevInfo {
  nombre: string;
  rol: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  avatar?: string;
  initials?: string;
  skills: string[];
  stacks: string[];
}

@Component({
  selector: 'app-contacto-index',
  templateUrl: './contacto-index.component.html',
  styleUrls: ['./contacto-index.component.scss'],
  standalone:false
})
export class ContactoIndexComponent {

  // Información general de contacto (la rellenas luego)
  infoGeneral = signal({
    telefono: '8437-1222',
    correo: 'annialvarodo@yahoo.es',
    direccion: 'Sabanilla de Alajuela',
    horario: 'Miércoles de 8am a 4pm',
  });

  // Equipo técnico / desarrolladores
  equipoTecnico = signal<DevInfo[]>([
    {
      nombre: 'Mario Vindas',
      rol: 'Full Stack Developer',
      bio: 'Encargado del desarrollo del frontend, UI/UX y arquitectura de módulos.',
      email: 'marioamurillo27@gmail.com',
      github: 'https://github.com/marioVMGIT',
      linkedin: 'https://www.linkedin.com/in/mario-andr%C3%A9s-vindas-murillo-58769a164/',
      avatar: '/mario.jpeg',
      skills: ['Angular', 'Material UI', 'Node.js', 'UI/UX'],
      stacks: ['Typescript', 'Express', 'Prisma', 'MySQL']
    },
    {
      nombre: 'Jorhan Alfaro',
      rol: 'Full Stack Developer',
      bio: 'Responsable del backend, integraciones, seguridad y despliegues.',
      email: 'jorhanalfavar@gmail.com ',
      github: 'https://github.com/JorhanAV',
      linkedin: 'https://www.linkedin.com/in/jorhan-alfaro-vargas-b15639208/',
      avatar: '/jorhan.jpeg',
      initials: 'D2',
      skills: ['NestJS', 'SQL', 'Microservicios', 'Testing'],
      stacks: ['Docker', 'REST APIs', 'JWT', 'CI/CD']
    }
  ]);

}
