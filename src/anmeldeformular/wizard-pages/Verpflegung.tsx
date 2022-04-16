import { Field } from 'react-final-form';
import Wizard from '../Wizard';
import { formatPrice } from '../helper/format-price';
import { AnmeldungKontext } from '../Anmeldeformular';
import { useContext } from '@wordpress/element';

export default function Food( { essen } ) {
	const { age } = useContext( AnmeldungKontext );
	const isFreeKidMeal = age <= 9;

	return (
		<Wizard.Page>
			<h2 className={ 'section-heading' }>Verpflegung</h2>
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
														isFreeKidMeal
															? 0
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
};
