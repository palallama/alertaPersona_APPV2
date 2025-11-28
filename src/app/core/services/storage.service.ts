import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private _initialized: boolean = false;

  constructor(private storage: Storage) {
    // No inicializar en el constructor para evitar problemas de dependencias
  }

  async init() {
    if (!this._initialized) {
      const storage = await this.storage.create();
      this._storage = storage;
      this._initialized = true;
    }
    return this._storage;
  }

  public async set(key: string, value: any) {
    await this.ensureInitialized();
    return this._storage?.set(key, value);
  }

  public async remove(key: string) {
    await this.ensureInitialized();
    return this._storage?.remove(key);
  }

  public async get(key: string) {
    await this.ensureInitialized();
    return await this._storage?.get(key) as string;
  }

  private async ensureInitialized() {
    if (!this._initialized) {
      await this.init();
    }
  }
}
