import moment from 'moment';
import type { WP_REST_API_Workshop } from '../types';

export const transformKinderprogramm = ( kinderprogramm ) => {
	return kinderprogramm.reduce( ( accumulator, programm ) => {
		const newAcc = { ...accumulator };
		const [ tag, zeit ] = programm.title.rendered.split( ' &#8211;' );
		if ( ! ( newAcc[ tag ] && newAcc[ tag ].length ) ) {
			newAcc[ tag ] = [];
		}
		newAcc[ tag ].push( { id: programm.id, zeit } );
		return newAcc;
	}, {} );
};

export const transformEssen = ( essenInput ) => {
	return essenInput.reduce( ( accumulator, essen ) => {
		const newAcc = { ...accumulator };
		const [ tag, mahlzeit, speise ] = essen.title.rendered.split( ' &#8211;' );

		if ( ! newAcc[ tag ] ) {
			newAcc[ tag ] = {};
		}

		if (
			! ( newAcc[ tag ] && newAcc[ tag ][ mahlzeit ] && newAcc[ tag ][ mahlzeit ].length )
		) {
			newAcc[ tag ][ mahlzeit ] = [];
		}
		newAcc[ tag ][ mahlzeit ].push( {
			id: essen.id,
			speise,
			price: essen.meta.price,
		} );
		return newAcc;
	}, {} );
};

export function groupEntitiesByDay( workshopsInput: Array<WP_REST_API_Workshop> ): {
	[key: string]: Array<WP_REST_API_Workshop>
} {
	return workshopsInput.reduce( ( accumulator, workshop ) => {
		const newWorkshops = { ...accumulator };
		const { startZeit } = workshop.meta;

		const day = moment( startZeit ).format( 'dddd' );

		if ( ! ( newWorkshops[ day ] && newWorkshops[ day ].length ) ) {
			newWorkshops[ day ] = [];
		}
		newWorkshops[ day ].push( workshop );
		return newWorkshops;
	}, {} );
};
