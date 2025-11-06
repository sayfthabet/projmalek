import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements AfterViewInit {
  showContent = false;

  @ViewChild('overlayGif') overlayGif!: ElementRef<HTMLImageElement>;

  ngAfterViewInit() {
    setTimeout(() => {
      this.showContent = true;
      this.overlayGif.nativeElement.style.display = 'none';
    }, 2800); // 2.8 secondes
  }
}