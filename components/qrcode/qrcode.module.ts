import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QRCode} from './qrcode.component';

@NgModule({
    imports: [CommonModule, QRCode],
    exports: [QRCode],
    declarations: [QRCode]
})
export class QRCodeModule {
}