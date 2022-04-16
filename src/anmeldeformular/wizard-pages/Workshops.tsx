import Card from '../components/Card';
import Wizard from '../Wizard';
import { groupEntitiesByDay } from '../helper/transform-data';
import type { WP_REST_API_Workshop } from '../types';

interface WorkshopsProps {
	workshops: Array<WP_REST_API_Workshop>
}

export default function Workshops( { workshops }: WorkshopsProps ) {
	const workshopsByDay = groupEntitiesByDay( workshops );
	const hasWorkshops = !! workshops.length;
	return (
		<Wizard.Page>
			<h2 className={ 'section-heading' }>Workshops</h2>
			<p>
				Deine Anmeldung ist verbindlich, aber das Anmeldeteam behält
				sich vor kurzfristig Änderungen vorzunehmen. Bitte achte darauf,
				dass sich die Workshops und Ausflüge zeitlich nicht
				überschneiden.
			</p>
			{ hasWorkshops &&
				Object.entries( workshopsByDay )
					.reverse()
					.map( ( [ day, workshops ] ) => (
						<div className={ `Workshops-${ day }` } key={ day }>
							<h3>{ day }</h3>
							<div className={ `workshop-list` }>
								{ workshops
									.reverse()
									.map( ( workshop ) => (
										<Card
											key={ workshop.id }
											{ ...workshop }
											description={
												workshop.meta.beschreibung
											}
											fieldGroup={ 'workshops' }
										/>
									) ) }
							</div>
						</div>
					) ) }
		</Wizard.Page>
	);
};
