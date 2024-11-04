import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemingService {

  constructor() { }

  activetheme: string = 'light';

  getTheme(){
    return this.activetheme
  }

  setTheme(theme:string){
    let themeLink = document.getElementById('app-theme') as HTMLLinkElement;

    if(themeLink){
      themeLink.href = theme + ".css";
    }
    this.activetheme = theme
  }
}
