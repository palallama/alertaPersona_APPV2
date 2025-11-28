export interface Marcador {
    position: Ubicacion
    title: string,
    icon?: string
}

export interface Ubicacion {
    latitud: number,
    longitud: number
}

export interface Ruta {
    origen: Ubicacion,
    destino: Ubicacion
}
