import { Injectable } from '@angular/core';

class globals {
  private NODE_ENV: string = 'development';

  private DEV_URL: string = 'http://localhost:3000';
  // private DEV_URL: string = 'https://d3bda50b4a2c.ngrok-free.app';
  private PROD_URL: string = 'https://api.example.com';
  private URL: string =
    this.NODE_ENV === 'development' ? this.DEV_URL : this.PROD_URL;

  public getURL(): string {
    return this.URL;
  }
}

@Injectable({
  providedIn: 'root',
})
export class globalInstance {
  private static instance: globals;

  private constructor() {}

  public static getInstance(): globals {
    if (!globalInstance.instance) {
      globalInstance.instance = new globals();
    }
    return globalInstance.instance;
  }
}
