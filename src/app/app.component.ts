
import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonSplitPane, IonMenu, IonRouterOutlet } from '@ionic/angular/standalone';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { StorageService } from './core/services/storage.service';
import { NotificacionService } from './core/services/notificacion.service';

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

  constructor() {
    // Puedes agregar iconos específicos aquí si los necesitas
  }

  async ngOnInit() {
    console.log("appcomponent - iniciarNotificaciones")
    // this.notificacionService.iniciarNotificaciones();
    // Inicializar el storage al iniciar la aplicación
    await this.storageService.init();
  }
}
