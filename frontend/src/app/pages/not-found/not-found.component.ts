import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <div class="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a routerLink="/">Go to Home</a>
    </div>
  `,
  styles: [`
    .not-found {
      text-align: center;
      padding: 3rem;
    }
    h1 {
      font-size: 3rem;
      color: #e74c3c;
    }
    a {
      margin-top: 2rem;
      display: inline-block;
      color: #3498db;
    }
  `]
})
export class NotFoundComponent {}
