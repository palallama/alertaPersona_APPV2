export interface Usuario {
    id?: string;
    nombre: string;
    apellido: string;
    nroDocumento: number;
    telefono: string;
    nroTramite: number;
    mail: string;
    validado?: boolean;
    activo?: boolean;
    password?: string;

    genero?: string;
    fchNacimiento?: Date;
    fechaCreacion?: Date;
    ultimoAcceso?: Date;

    token?: string;

    preferencias?: UsuarioPreferencia[];
}

export interface UsuarioLogueado {
    id: string;
    nombre: string;
    mail: string;
}

export enum UsuarioPreferencias {
}

export interface UsuarioPreferencia {
    usuarioId: number;
    clave: string;
    usuario?: Usuario;
}

export enum PreferenciasClave {
    NOTIFICACION = "NOTIFICACION",
    EMAIL = "EMAIL",
    SMS = "SMS"
}

// Esta constante ya no se usa, las preferencias se manejan en preferences.data.ts
export const PreferenciasData: UsuarioPreferencia[] = []