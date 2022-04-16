import Wizard from '../Wizard';
import Card from '../components/Card';
import { groupEntitiesByDay } from '../helper/transform-data';

export default function Ausfluege( { ausfluege } ) {
	const transformedAusfluege = groupEntitiesByDay( ausfluege );
	return (
		<Wizard.Page>
			<h2 className={ 'section-heading' }>Ausflüge</h2>
			<p>
				Deine Anmeldung ist verbindlich, aber das Anmeldeteam behält
				sich vor kurzfristig Änderungen vorzunehmen. Bitte achte darauf,
				dass sich die Workshops und Ausflüge zeitlich nicht
				überschneiden.
			</p>
			{ transformedAusfluege &&
				Object.keys( transformedAusfluege )
					.reverse()
					.map( ( tag ) => (
						<div
							key={ `Ausfluege-${ tag }` }
							className={ `Ausfluege-${ tag }` }
						>
							<h3>{ tag }</h3>
							<div className="ausfluege-list">
								{ transformedAusfluege[ tag ]
									.reverse()
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
};
