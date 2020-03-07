import { render, useState, useEffect } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';
import apiFetch from '@wordpress/api-fetch';
import { Spinner } from '@wordpress/components';

import { transformAnmeldungen, transformWp, getAnmeldungen } from './helper';

const KinderprogrammAnmeldungen = () => {
	const [ anmeldungen, setAnmeldungen ] = useState( [] );
	const [ kinderprogramm, setKinderprogramm ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );

	useEffect( () => {
		Promise.all( [ 
            apiFetch( { path: 'wp/v2/anmeldung?per_page=5000' } ),
            apiFetch( { path: 'wp/v2/kinderprogramm?per_page=99' } ) 
        ] )
			.then( ( [ anmeldungen, kinderprogramm ] ) => {
				setAnmeldungen( transformAnmeldungen( anmeldungen ) );
				setKinderprogramm( transformWp( kinderprogramm ) );
				setIsLoading( false );
			} )
			.catch( ( error ) => console.error( error ) );
	}, [] );

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
                        { kinderprogramm.map( programm => { 

                            const programmAnmeldungen = getAnmeldungen( anmeldungen, 'kinderprogramm', programm.id);
                            
                            return (
                                <tr>
                                    <td dangerouslySetInnerHTML={{__html: programm.title}}></td>
                                    <td>{ programmAnmeldungen }</td>
                                </tr>
                            )
                        } ) }
                    </tbody>
                </table>
                </>
			) }
		</>
	);
};

domReady( () => {
	render(
		<KinderprogrammAnmeldungen />,
		document.getElementById( 'anmeldungen-kinderprogramm' )
	);
} );
