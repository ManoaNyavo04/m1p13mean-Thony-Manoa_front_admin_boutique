import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarService, SnackbarMessage } from '../../services/snackbar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css']
})
export class SnackbarComponent implements OnInit, OnDestroy {
  messages: Array<SnackbarMessage & { id: number }> = [];
  private subscription?: Subscription;
  private idCounter = 0;

  constructor(
    private snackbarService: SnackbarService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscription = this.snackbarService.snackbar$.subscribe((message) => {
      console.log('Snackbar reçu:', message);
      const id = this.idCounter++;
      this.messages.push({ ...message, id });
      console.log('Messages array:', this.messages);
      console.log('Messages length:', this.messages.length);
      this.cdr.detectChanges();
      setTimeout(() => this.removeMessage(id), 3000);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  removeMessage(id: number) {
    this.messages = this.messages.filter(m => m.id !== id);
  }

  getIcon(type: string): string {
    switch(type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      default: return 'ℹ';
    }
  }
}
