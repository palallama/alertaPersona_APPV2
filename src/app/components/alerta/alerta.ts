export interface AlertButton {
    text: string;
    handler?: (inputValue?: any) => boolean | void | Promise<boolean | void>;
    cssClass?: string;
    role?: string;
}