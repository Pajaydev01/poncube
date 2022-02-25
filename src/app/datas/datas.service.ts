import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatasService {
  category: any;
  isLogged: boolean;


  constructor() { }

  save_category(item){
    this.category=item;
  }

  fetch_category(){
    return this.category;
  }

  savelog(){
    this.isLogged=true;
  }

  clearlog(){
    this.isLogged=false;
  }

  getlog(){
    return this.isLogged;
  }
}
