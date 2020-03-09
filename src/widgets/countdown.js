import { render } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';

import moment from 'moment';

const CountdownTimer = () => {
    
    const eventdate = moment("2020-05-21");
    const todaysdate = moment();
    const daysUntill = eventdate.diff(todaysdate, 'days');

	return (
		<>
			<h3 className="countdown-timer">{ `Noch ${daysUntill} ${ daysUntill === 1 ? 'Tag' : 'Tage' } bis zum Gemeindetag 2020!` }</h3>
		</>
	);
};

domReady( () => {
	render(
		<CountdownTimer />,
		document.getElementById( 'countdown-timer' )
	);
} );
