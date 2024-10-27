import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, InputGroupModule, InputTextModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] // Corrected to styleUrls
})
export class AppComponent implements OnInit {
  title = 'Entzone';
  isonline = navigator.onLine; // Initialize directly based on navigator.onLine

  constructor(private fb: FormBuilder,
    private router:Router
   ) {
    
  }

  menuitems = [
    {
      name: 'Home',
      icon: 'pi pi-home',
      route: 'home'
    },
    {
      name: 'Explore',
      icon: 'pi pi-compass',
      route: 'explore'
    }
  ];
  searchform!:FormGroup ;

  ngOnInit(): void {
    // Listen for online/offline events
    window.addEventListener('online', this.updateOnlineStatus.bind(this));
    window.addEventListener('offline', this.updateOnlineStatus.bind(this));
    this.form()
  }


  private form() {
    this.searchform = this.fb.group(
      {
        query: ['']
      }
    )
  }


  updateOnlineStatus(): void {
    this.isonline = navigator.onLine; // Update isonline based on navigator's state
  }


  search() {
    const controls = this.searchform.controls

    const query = controls['query'].value

    this.router.navigate(['/search', query])
  }

}