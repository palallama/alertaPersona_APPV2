
import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonSplitPane, IonMenu, IonRouterOutlet } from '@ionic/angular/standalone';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { StorageService } from './core/services/storage.service';
import { NotificacionService } from './core/services/notificacion.service';
import { Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    IonApp,
    IonSplitPane,
    IonMenu,
    IonRouterOutlet,
    SideMenuComponent
  ],
})
export class AppComponent implements OnInit {
  private notificacionService = inject(NotificacionService);
  private storageService = inject(StorageService);
  private router = inject(Router);

  constructor() {
    // Puedes agregar iconos específicos aquí si los necesitas
    this.initializeApp();
  }

  initializeApp() {
    // Escuchar cuando la app se abre desde un deep link
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      console.log('App opened with URL:', event.url);
      this.handleDeepLink(event.url);
    });
  }

  handleDeepLink(url: string) {
    // Parsear la URL para obtener el path
    // Ejemplo: https://alertapersona.com/invitacion/user_AVzk0rsbLk
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      
      console.log('Deep link path:', path);
      
      // Navegar a la ruta correspondiente
      this.router.navigateByUrl(path);
    } catch (error) {
      console.error('Error parsing deep link:', error);
    }
  }

  async ngOnInit() {
    console.log("appcomponent - iniciarNotificaciones")
    // this.notificacionService.iniciarNotificaciones();
    // Inicializar el storage al iniciar la aplicación
    await this.storageService.init();
  }
}
