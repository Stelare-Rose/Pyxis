import moment from 'moment'
export const Sort = (prop?: string) => {
	return function(a: any, b: any){
		const ta = a.startDate ? a.startDate : a.endDate ? a.endDate : a.priorityDate;
		const tb = b.startDate ? b.startDate : b.endDate ? b.endDate : b.priorityDate;
		const ua: number | null = ta ? moment(ta).unix() : null;
		const ub: number | null = tb ? moment(tb).unix() : null;

		if(prop == "doneLast"){
			if(a.status == 'Done') return 1;
			if(b.status == 'Done') return -1;
		}
		if(!ua) return 1;
		if(!ub) return -1;
		if(ua === ub){
			return 0;
		}
		return ua < ub ? -1 : 1;
	}
}
