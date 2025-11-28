import { MessageService } from 'primeng/api';

export function showSuccess(messageService: MessageService, summary: string, detail: string) {
  messageService.add({ severity: 'success', summary, detail });
}

export function showError(messageService: MessageService, summary: string, detail: string) {
  messageService.add({ severity: 'error', summary, detail });
}

export function showWarn(messageService: MessageService, summary: string, detail: string) {
  messageService.add({ severity: 'warn', summary, detail });
}

export function showInfo(messageService: MessageService, summary: string, detail: string) {
  messageService.add({ severity: 'info', summary, detail });
}
