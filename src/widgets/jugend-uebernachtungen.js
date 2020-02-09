import { render, useState, useEffect } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';
import apiFetch from '@wordpress/api-fetch';
import { Spinner } from '@wordpress/components';

import { transformAnmeldungen } from './helper';

const JugendUebernachtungen = () => {
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

    const amountJugendUebernachtungen = anmeldungen
        .filter( anmeldung => anmeldung.uebernachtung_and_breakfast )
        .length

    const turnhalle = anmeldungen.filter( anmeldung => anmeldung.uebernachtung === 'Turnhalle' ).length;
    const eigenesZelt = anmeldungen.filter( anmeldung => anmeldung.uebernachtung === 'Eigenes Zelt' ).length;
    const imZeltWith = anmeldungen.filter( anmeldung => anmeldung.uebernachtung === 'Im Zelt mit...' ).length;

	return (
		<>
			{ isLoading ? (
				<Spinner />
			) : (
                <>
                <table className={ 'wp-list-table widefat striped tickets' }>
                    <thead>
                        <tr>
                            <th className={ 'column-title' }>Titel</th>
                            <th className={ 'column-title' }></th>
                        </tr>
                    </thead>
                    <tbody id="the-list">
                        <tr>
                            <td>Anmeldungen</td>
                            <td>{ amountJugendUebernachtungen }</td>
                        </tr>
                        <tr>
                            <td>Turnhalle</td>
                            <td>{ turnhalle }</td>
                        </tr>
                        <tr>
                            <td>Eigenes Zelt:</td>
                            <td>{ eigenesZelt }</td>
                        </tr>
                        <tr>
                            <td>Im Zelt mit...</td>
                            <td>{ imZeltWith }</td>
                        </tr>
                    </tbody>
                </table>
                </>
			) }
		</>
	);
};

domReady( () => {
	render(
		<JugendUebernachtungen />,
		document.getElementById( 'jugend-uebernachtungen' )
	);
} );
