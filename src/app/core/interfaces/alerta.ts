import { Asistente } from "./asistente";
import { Ubicacion } from "./marcador";
import { Usuario } from "./usuario";

export interface Alerta {

    id?: string,
    usuarioId?: string,
    usuario?: Usuario,
    latitud: number,
    longitud: number,
    estado: string,
    fchEmision?: Date,
    fchCierre?: Date,
    cerrada?: boolean,

    asistentes?: Asistente[],
}

export interface AlertaHistorial extends Alerta {
    tipo: 'emitida' | 'asistida',
    estadoAsistencia?: string,
    observacionAsistencia?: string,
}

export interface Historial {
    emitidas: AlertaHistorial[],
    asistidas: AlertaHistorial[]
}

