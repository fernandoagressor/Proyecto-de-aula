import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html'
})
export class App implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuarioLogueado');

    if (usuario) {
      this.router.navigate(['/panel/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
