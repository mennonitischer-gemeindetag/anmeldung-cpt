import { render, useState, useEffect } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';
import apiFetch from '@wordpress/api-fetch';
import { Spinner } from '@wordpress/components';

import { transformAnmeldungen } from './helper';

const Mennoconnect = () => {
	const [ anmeldungen, setAnmeldungen ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );

	useEffect( () => {
		Promise.all( [ apiFetch( { path: 'wp/v2/anmeldung?per_page=5000' } ) ] )
			.then( ( [ anmeldungen ] ) => {
				setAnmeldungen( transformAnmeldungen( anmeldungen ) );
				setIsLoading( false );
			} )
			.catch( ( error ) => console.error( error ) );
	}, [] );

    const mennoconnecAge = anmeldungen.filter(
		( anmeldung ) => ( 13 <= anmeldung.age && anmeldung.age <= 30)
	);
	return (
		<>
			{ isLoading ? (
				<Spinner />
			) : (
                <h3>{ `Es gibt ${mennoconnecAge.length} Anmeldungen von 13-30 Jährigen.` }</h3>
			) }
		</>
	);
};

domReady( () => {
	render(
		<Mennoconnect />,
		document.getElementById( 'mennoconnect' )
	);
} );
