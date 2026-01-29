import { Component, inject, computed, signal, HostListener, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../core/services/auth.service';
import { CreateTaskDialogComponent } from '../features/landing/create-task-dialog/create-task-dialog.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatDialogModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  @ViewChild('userMenu') userMenuRef?: ElementRef<HTMLElement>;

  readonly userMenuOpen = signal(false);
  readonly user = this.auth.user;
  readonly displayName = computed(() => {
    const u = this.user();
    if (!u) return 'User';
    return u.displayName || u.email?.split('@')[0] || 'User';
  });
  readonly initials = computed(() => {
    const name = this.displayName();
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  });

  onCreate(): void {
    this.dialog.open(CreateTaskDialogComponent, {
      width: '520px',
      disableClose: false,
      panelClass: 'create-task-dialog-panel',
    });
  }

  closeUserMenuAndLogout(): void {
    this.userMenuOpen.set(false);
    this.logout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const menu = this.userMenuRef?.nativeElement;
    if (this.userMenuOpen() && target && menu && !menu.contains(target)) {
      this.userMenuOpen.set(false);
    }
  }

  logout(): void {
    this.auth.logout().subscribe();
  }
}
