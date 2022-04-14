import { formatPrice } from '../helper/format-price';

export default function Table( props ) {
	return (
		<table>
			<tbody>{ props.children }</tbody>
		</table>
	);
}

export function TableRow( { key, title, price } ) {
	return (
		<tr key={ key } className="table-row">
			<td dangerouslySetInnerHTML={ { __html: title } }></td>
			<td className="price">{ formatPrice( price ) }</td>
		</tr>
	);
}

export function TableHeader( { title, price } ) {
	return (
		<tr className="table-heading">
			<th dangerouslySetInnerHTML={ { __html: title } }></th>
			<th className="price">{ price }</th>
		</tr>
	);
}

export function TableFooter( { title, price } ) {
	return (
		<tr className="table-footer">
			<td dangerouslySetInnerHTML={ { __html: title } }></td>
			<td className="price">{ formatPrice( price ) }</td>
		</tr>
	);
}
