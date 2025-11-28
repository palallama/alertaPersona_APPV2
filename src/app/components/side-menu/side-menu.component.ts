import { Component, OnInit, ElementRef, Renderer2, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { 
  IonContent, 
  IonIcon, 
  IonButton 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  chevronBackOutline,
  homeOutline,
  personOutline,
  timeOutline,
  settingsOutline,
  locationOutline,
  peopleOutline,
  headsetOutline,
  logOutOutline
} from 'ionicons/icons';
import { MENU_ITEMS, FOOTER_BUTTONS, MenuItem, FooterButton } from './data';
import { filter } from 'rxjs/operators';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Usuario } from 'src/app/core/interfaces/usuario';
import { AuthService } from 'src/app/core/services/auth';
import { UserStorageService } from 'src/app/core/services/user-storage';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, IonButton]
})
export class SideMenuComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private userStorage = inject(UserStorageService);
  
  menuItems: MenuItem[] = [...MENU_ITEMS];
  footerButtons: FooterButton[] = FOOTER_BUTTONS;
  usuarioActual?: Usuario;

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    addIcons({
      chevronBackOutline,
      homeOutline,
      personOutline,
      timeOutline,
      settingsOutline,
      locationOutline,
      peopleOutline,
      headsetOutline,
      logOutOutline
    });
  }

  ngOnInit() {
    this.cargarUsuarioActual();
    
    // Establecer el item activo inicial basado en la ruta actual
    this.setActiveItem(this.router.url);
    
    // Escuchar cambios de ruta para actualizar el item activo
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.setActiveItem(event.url);
      });
  }

  async cargarUsuarioActual() {
    try {
      const usuario = await this.userStorage.getUsuario();
      if (usuario) {
        // Cargar datos completos si es necesario
        const usuarioCompleto = await this.usuarioService.getUsuario(usuario.id).toPromise() as Usuario;
        this.usuarioActual = usuarioCompleto;
      }
    } catch (error) {
      console.error('Error cargando usuario:', error);
    }
  }

  navigateTo(event: Event, route: string, itemId?: string) {
    // Solo prevenir el comportamiento por defecto
    event.preventDefault();
    
    // Navegar inmediatamente
    this.router.navigate([route]);
    
    if (itemId) {
      this.setActiveItemById(itemId);
    }
    
    // Cerrar el menú después de navegar
    this.menuCtrl.close();
  }

  private setActiveItem(currentRoute: string) {
    this.menuItems.forEach(item => {
      item.isActive = item.route === currentRoute;
    });
  }

  private setActiveItemById(itemId: string) {
    this.menuItems.forEach(item => {
      item.isActive = item.id === itemId;
    });
  }

  handleFooterAction(event: Event, action: 'support' | 'logout') {
    event.preventDefault();
    
    switch (action) {
      case 'support':
        this.openSupport();
        break;
      case 'logout':
        this.logout();
        break;
    }
    
    // Cerrar menú después de la acción
    this.menuCtrl.close();
  }

  private openSupport() {
    console.log('Abrir soporte');
    // Abrir la web de soporte configurada en el environment
    window.open(environment.webUrl, '_blank');
  }

  private async logout() {
    try {
      console.log('Cerrando sesión...');
      this.authService.cerrarSesion();
      this.usuarioActual = undefined;
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  }
}
