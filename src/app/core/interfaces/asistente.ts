export interface Asistente {
    alertaId: string;
    usuarioId: number;
    estado: AsistenteAccion;
    observacion: string;
    usuario?: {
        id: number;
        nombre: string;
        apellido: string;
        telefono: string;
    };
}

export enum AsistenteAccion {
    ASISTE = "A",
    RECHAZA = "R"
}