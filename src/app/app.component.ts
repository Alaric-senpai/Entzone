import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { Message, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, InputGroupModule, InputTextModule,
  MessagesModule, ButtonModule, ReactiveFormsModule, DialogModule, ToastModule],
  templateUrl: './app.component.html',
  providers: [MessageService],
  styleUrls: ['./app.component.scss'] // Corrected to styleUrls
})
export class AppComponent implements OnInit {
  menuVisible: boolean = true;
  displayDialog: boolean = false;

  showDialog() {
    this.displayDialog = true;
  }

  message: Message[] =[{
    severity: 'success',
    summary: 'Entzone Notice',
    icon: "pi pi-info-circle",
    styleClass: 'p-2 flex flex-column gap-2',
    detail: ' Entzone uses torrents for downloading ensure you have a torrent downloading software before proceeding',
  }];
  togglemenu(){
    if(this.menuVisible == true){
      this.menuVisible = false
    }else{
      this.menuVisible = true
    }
  }

  title = 'Entzone';
  isonline = navigator.onLine; // Initialize directly based on navigator.onLine

  constructor(private fb: FormBuilder,
    private router:Router,
    private ms:MessageService
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

    if(query.trim() !== " "){
      this.displayDialog = false;
      this.router.navigate(['/search', query])
    }else{
      this.displayDialog = false
      this.ms.add(
      {
        summary: 'Blank query',
        severity: 'error',
        detail: 'Query cannot be blank',
        styleClass: 'p-2'
      })
    }

  }

}