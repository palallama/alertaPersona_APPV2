import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/components/alerta/alerta.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DebugService {
    private alerts = inject(AlertService);
    private router = inject(Router);

    constructor() {
        if (!environment.production && typeof window !== 'undefined') {
            (window as any).debug = this;
            console.log('🐛 Debug Service activado. Usa debug.help() para ver comandos disponibles.');
        }
    }

    help() {
        console.log(`
        debug.testAlerta()
        \t- Muestra un diálogo de alerta simple con botones
        debug.testAlertaConMensaje()
        \t- Muestra un diálogo con campo de entrada de texto
        debug.asistirAlerta(alertaid: number)
        \t- Navega a la página de asistencia para la alerta con el ID proporcionado
        debug.help()
        \t- Muestra esta ayuda
        `);
    }

    async testAlerta() {
        await this.alerts.showAlert({
            title: 'Alerta de prueba',
            message: 'Esta es una alerta de prueba para verificar el sistema de alertas.',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {
                        console.log('El usuario canceló');
                        return true; // Cierra el alerta
                    }
                },
                {
                    text: 'Aceptar',
                    role: 'confirm',
                    handler: () => {
                        console.log('El usuario aceptó');
                        return true; // Cierra el alerta
                    }
                }
            ]
        });
    }

    async testAlertaConMensaje() {
        const resultado = await this.alerts.showInputAlert({
            title: 'Alerta de prueba con mensaje',
            message: 'Ingrese un texto de prueba: ',
            inputType: 'text',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel'
                },
                {
                    text: 'Aceptar',
                    role: 'confirm',
                    handler: (valor) => {
                        if (!valor) {
                            console.log('El campo no puede estar vacío');
                            return false; // Evita que se cierre
                        }
                        return true; // Permite que se cierre
                    }
                }
            ]
        });

        // Verificar el resultado
        if (resultado?.role === 'confirm') {
            console.log('Valor ingresado:', resultado.value);
        } else {
            console.log('El usuario canceló la operación');
        }
    }

    asistirAlerta(alertaid: number) {
        if (!alertaid) return;
        this.router.navigateByUrl(`/assist-alert/${alertaid}`);
    }

}
