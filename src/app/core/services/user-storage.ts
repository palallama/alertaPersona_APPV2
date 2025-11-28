import { inject, Injectable } from '@angular/core';
import { UsuarioLogueado } from '../interfaces/usuario';
import { StorageService } from './storage.service';
import { StorageKeys } from '../interfaces/storage';

const STORAGE_KEY = 'usuario'

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {
  private storageService = inject(StorageService);

  async setUsuario(usuario: UsuarioLogueado): Promise<void> {
    await this.storageService.set(StorageKeys.USUARIO, JSON.stringify(usuario));
  }

  async getUsuario(): Promise<UsuarioLogueado | null> {
    const usuario = await this.storageService.get(StorageKeys.USUARIO);
    return usuario ? JSON.parse(usuario) as UsuarioLogueado : null;
  }

  async clearUsuario(): Promise<void> {
    await this.storageService.remove(StorageKeys.USUARIO);
  }
}
