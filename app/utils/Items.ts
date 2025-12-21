import moment from "moment";

const today = moment().endOf('day').seconds(0).milliseconds(0).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
export const ItemToPlainTextRow = (name: string, property?: string) => {
	if(!property || property.length < 1) return '';
	return `[${name}]:${property}\n`;
}

export const CompletedCheck = (curr: Item, prev?: Item) => {
	// If CompletedDate is Empty, Immediately set it to Today
	if(curr.status == 'Done' && curr.completedDate === undefined){
		curr.completedDate = today;
	}
	// If Prev is Undefined, and Curr is Completed, set completedDate = today
	if(prev === undefined && curr.status == 'Done'){
		curr.completedDate = today;
	}

	// Case if Prev is Undef
	if(prev === undefined) return;

	// If Changed from x -> Completed, set completedDate = today
	if(prev.status != 'Done' && curr.status == 'Done'){
		curr.completedDate = today;
	} 

	// If Changed from Completed -> x, clear completedDate
	if(prev.status == 'Done' && curr.status != 'Done'){
		curr.completedDate = null;
	}
}
