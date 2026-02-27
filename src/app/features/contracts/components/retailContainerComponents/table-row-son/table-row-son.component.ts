import { Component, Input } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { decinalFormat } from 'src/app/shared/utils/number-format';
import { reatailContainerDetail } from '../../../models/retailContainer.model';

@Component({
	selector: '[app-table-row-son]',
	imports: [AngularSvgIconModule],
	templateUrl: './table-row-son.component.html',
	styleUrl: './table-row-son.component.css',
})
export class TableRowSonComponent {
	@Input() rcontainerDetail!: reatailContainerDetail;
	decinalFormat = decinalFormat;
}
