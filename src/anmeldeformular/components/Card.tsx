import { Field } from 'react-final-form';
import moment from 'moment';
import { formatPrice } from '../helper/format-price';

const Card = ( props ) => {
	const {
		meta: {
			nr,
			startZeit,
			endZeit,
			leiter,
			preis,
			character,
			registrationClosed,
		},
		fieldGroup,
		id,
		title,
		description,
	} = props;

	const isDisabled = registrationClosed ? `is-disabled` : ``;

	return (
		<div className={ `${ fieldGroup } card ${ isDisabled }` }>
			<label htmlFor={ id }>
				<div className={ 'element-header' }>
					<span
						className={ 'numerierung' }
					>{ `${ character }${ nr }` }</span>
					<span className={ 'zeit' }>
						<span className={ 'startzeit' }>
							{ moment( startZeit ).format( 'HH:mm' ) }
						</span>{ ' ' }
						-{ ' ' }
						<span className={ 'endzeit' }>
							{ moment( endZeit ).format( 'HH:mm' ) }
						</span>
					</span>
				</div>
				<h4
					className={ 'element-heading' }
					dangerouslySetInnerHTML={ { __html: title.rendered } }
				/>
				{ !! description && (
					<details className={ 'bechreibung' }>
						<summary>Beschreibung:</summary>
						<p
							dangerouslySetInnerHTML={ { __html: description } }
						/>
					</details>
				) }
				{ leiter && (
					<span className={ 'person' }>mit: { leiter }</span>
				) }
				{ !! preis && (
					<span className={ 'preis' }>{ formatPrice( preis ) }</span>
				) }
				<Field
					component="input"
					name={ fieldGroup }
					type="checkbox"
					id={ id }
					value={ id }
					disabled={ registrationClosed }
				/>
			</label>
		</div>
	);
};
export default Card;
