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
    telefono: '0000-0000',
    correo: 'contacto@aamsa.com',
    direccion: 'Dirección de la empresa…',
    horario: 'Lunes a Viernes de 8am a 5pm',
  });

  // Equipo técnico / desarrolladores
  equipoTecnico = signal<DevInfo[]>([
    {
      nombre: 'Nombre Dev 1',
      rol: 'Full Stack Developer',
      bio: 'Encargado del desarrollo del frontend, UI/UX y arquitectura de módulos.',
      email: 'correo@dev1.com',
      github: 'https://github.com/dev1',
      linkedin: 'https://linkedin.com/in/dev1',
      avatar: 'https://i.pravatar.cc/300?img=12',
      skills: ['Angular', 'Material UI', 'Node.js', 'UI/UX'],
      stacks: ['Typescript', 'Express', 'Prisma', 'MySQL']
    },
    {
      nombre: 'Nombre Dev 2',
      rol: 'Backend & Infra Engineer',
      bio: 'Responsable del backend, integraciones, seguridad y despliegues.',
      email: 'correo@dev2.com',
      github: 'https://github.com/dev2',
      linkedin: 'https://linkedin.com/in/dev2',
      initials: 'D2',
      skills: ['NestJS', 'SQL', 'Microservicios', 'Testing'],
      stacks: ['Docker', 'REST APIs', 'JWT', 'CI/CD']
    }
  ]);

}
