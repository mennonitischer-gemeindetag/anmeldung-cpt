import Card from '../components/Card';
import Wizzard from '../Wizzard';
import { transformWorkshops } from '../helper/transform-data';

export default ( { workshops } ) => {
	const transformedWorkshops = transformWorkshops( workshops );
	return (
		<Wizzard.Page>
			<h2 className={ 'section-heading' }>Workshops</h2>
			<p>
				Deine Anmeldung ist verbindlich, aber das Anmeldeteam behält sich vor
				kurzfristig Änderungen vorzunehmen. Bitte achte darauf, dass sich die
				Workshops und Ausflüge zeitlich nicht überschneiden.
			</p>
			{ transformedWorkshops &&
				Object.keys( transformedWorkshops )
					.reverse()
					.map( ( tag ) => (
						<div className={ `Workshops-${ tag }` }>
							<h3>{ tag }</h3>
							<div className={ `workshop-list` }>
								{ transformedWorkshops[ tag ].reverse().map( ( workshop ) => (
									<Card
										key={ workshop.id }
										{ ...workshop }
										description={ workshop.meta.beschreibung }
										fieldGroup={ 'workshops' }
									/>
								) ) }
							</div>
						</div>
					) ) }
		</Wizzard.Page>
	);
};
