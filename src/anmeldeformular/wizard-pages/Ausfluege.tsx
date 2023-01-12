import Wizard from '../Wizard';
import Card from '../components/Card';
import { groupEntitiesByDay } from '../helper/transform-data';
import { useRef, useEffect } from '@wordpress/element';
import { WP_REST_API_Ausfluege } from '../types';

interface AusfluegeProps {
	ausfluege: Array< WP_REST_API_Ausfluege >;
}

export default function Ausfluege( { ausfluege } ) {
	const transformedAusfluege = groupEntitiesByDay( ausfluege );
	const headingRef = useRef( null );
	useEffect( () => {
		if ( headingRef.current ) {
			headingRef.current.scrollIntoView();
		}
	}, [] );
	return (
		<Wizard.Page>
			<h2 className={ 'section-heading' } ref={ headingRef }>
				Ausflüge
			</h2>
			<p>
				Deine Anmeldung ist verbindlich, aber das Anmeldeteam behält
				sich vor kurzfristig Änderungen vorzunehmen. Bitte achte darauf,
				dass sich die Workshops und Ausflüge zeitlich nicht
				überschneiden.
			</p>
			{ transformedAusfluege &&
				Object.entries( transformedAusfluege )
					.filter(
						( [ _, innerAusfluege ] ) => innerAusfluege.length
					)
					.map( ( [ tag, innerAusfluege ] ) => (
						<div
							key={ `Ausfluege-${ tag }` }
							className={ `Ausfluege-${ tag }` }
						>
							<h3>{ tag }</h3>
							<div className="ausfluege-list">
								{ innerAusfluege
									.sort( ( a, b ) => a.meta.nr - b.meta.nr )
									.map( ( ausflug ) => (
										<Card
											key={ ausflug.id }
											{ ...ausflug }
											fieldGroup={ 'ausfluege' }
										/>
									) ) }
							</div>
						</div>
					) ) }
		</Wizard.Page>
	);
}
