import { Router } from "@angular/router";
import { Alerta } from "../interfaces/alerta";
import { AlertaEstados } from "../interfaces/alerta-estados";
import { Ubicacion } from "../interfaces/marcador";
import { LocalizacionService } from "../services/localizacion.service";

export async function emitirAlerta(localizacionService: LocalizacionService, router: Router) {
    console.log('¡ALERTA ACTIVADA!');

    // // Obtener ubicación actual
    // const coords = await localizacionService.obtenerLocalizacion();
    // const ubicacion: Ubicacion = {
    //     latitud: coords.latitude,
    //     longitud: coords.longitude
    // };
    
    // // Crear alerta
    // const nuevaAlerta: Alerta = {
    //     usuarioId: '', // Se llenará en el servicio con el usuario actual
    //     estado: AlertaEstados.EMITIDA,
    //     latitud: coords.latitude,
    //     longitud: coords.longitude,
    //     cerrada: false
    // };
    
    // Navegar a la página de emisión de alerta
    router.navigate(['/emit-alert'], {
        // state: { alerta: nuevaAlerta }
    });
}