import { Component, OnInit } from '@angular/core';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DropdownItemTwoComponent } from '../../ui/dropdown/dropdown-item/dropdown-item.component-two';
import { UtilisateursService } from '../../../services/utilisateur/utilisateurs.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  imports:[CommonModule,RouterModule,DropdownComponent,DropdownItemTwoComponent]
})
export class UserDropdownComponent implements OnInit {
  isOpen = false;
  userName = 'User';
  userEmail = 'user@example.com';

  constructor(
    private utilisateursService: UtilisateursService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userInfo = this.utilisateursService.getUserInfo();
    if (userInfo) {
      this.userName = userInfo.nom;
      this.userEmail = userInfo.mail;
    }
  }

  getInitial(): string {
    return this.userName ? this.userName.charAt(0).toUpperCase() : 'U';
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  logout(): void {
    const userRole = this.authService.getUserRole();
    this.utilisateursService.removeToken();
    localStorage.removeItem('user_info');
    
    if (userRole === 'ADMIN') {
      this.router.navigate(['/admin/login']);
    } else {
      this.router.navigate(['/boutique/login']);
    }
  }
}