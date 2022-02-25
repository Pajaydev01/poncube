import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
@Component({
  selector: 'app-guides',
  templateUrl: './guides.page.html',
  styleUrls: ['./guides.page.scss'],
})
export class GuidesPage implements OnInit {

  constructor(
    public popoverController: PopoverController,
  ) { }

  ngOnInit() {
  }

  close() {
    this.popoverController.dismiss();
  }
}
