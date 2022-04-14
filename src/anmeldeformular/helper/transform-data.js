import moment from 'moment';

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

export const transformWorkshops = ( workshopsInput ) => {
	return workshopsInput.reduce( ( accumulator, workshop ) => {
		const newWorkshops = { ...accumulator };
		const { startZeit, endZeit } = workshop.meta;

		const tag = moment( startZeit ).format( 'dddd' );

		if ( ! ( newWorkshops[ tag ] && newWorkshops[ tag ].length ) ) {
			newWorkshops[ tag ] = [];
		}
		newWorkshops[ tag ].push( workshop );
		return newWorkshops;
	}, {} );
};
