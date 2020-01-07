import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {QRCodeDemo} from './qrcodedemo';
import {QRCodeDemoRoutingModule} from './qrcodedemo-routing.module';
import {QRCodeModule} from '../../../components/qrcode/qrcode';
import {CodeHighlighterModule} from 'primeng/codehighlighter';

@NgModule({
	imports: [
		CommonModule,
		QRCodeDemoRoutingModule,
		QRCodeModule,
        CodeHighlighterModule,
	],
	declarations: [
		QRCodeDemo
	]
})
export class QRCodeDemoModule {}
