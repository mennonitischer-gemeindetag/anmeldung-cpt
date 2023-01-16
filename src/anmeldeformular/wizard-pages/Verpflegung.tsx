import { Field, useFormState } from 'react-final-form';
import Wizard from '../Wizard';
import { useRef, useEffect, useContext } from '@wordpress/element';
import { formatPrice } from '../helper/format-price';

import { AnmeldungKontext } from '../Anmeldeformular';

export default function Food( { essen } ) {
	const headingRef = useRef( null );
	useEffect( () => {
		if ( headingRef.current ) {
			headingRef.current.scrollIntoView();
		}
	}, [] );

	const { age } = useContext( AnmeldungKontext );

	const isKid = age <= 12;

	return (
		<Wizard.Page>
			<h2 ref={ headingRef } className={ 'section-heading' }>
				Verpflegung
			</h2>
			<div>
				{ Object.keys( essen )
					.reverse()
					.map( ( day ) => (
						<div key={ day }>
							<h3>{ day }</h3>
							{ Object.keys( essen[ day ] )
								.reverse()
								.map( ( mahlzeit ) => (
									<>
										<p>
											<b>{ mahlzeit }</b>
										</p>
										{ essen[ day ][ mahlzeit ]
											.reverse()
											.map( ( speise ) => (
												<div key={ speise.id }>
													<Field
														id={ speise.id }
														name={ `verpflegung` }
														value={ speise.id }
														type="checkbox"
														component={ `input` }
													/>
													<label
														htmlFor={ speise.id }
													>{ `${
														speise.speise
													} - ${ formatPrice(
														isKid
															? Number(
																	speise.price
															  ) / 2
															: speise.price
													) }` }</label>
												</div>
											) ) }
									</>
								) ) }
						</div>
					) ) }
			</div>
		</Wizard.Page>
	);
}
