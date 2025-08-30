import moment from 'moment'
export const Sort = (prop?: string) => {
	return function(a: any, b: any){
		const ta = a.softDeadline ? a.softDeadline: a.hardDeadline;
		const tb = b.softDeadline ? b.softDeadline : b.hardDeadline;
		const ua: number | null = ta ? moment(ta).unix() : null;
		const ub: number | null = tb ? moment(tb).unix() : null;

		if(!ua) return 1;
		if(!ub) return -1;
		if(ua === ub){
			return 0;
		}
		return ua < ub ? -1 : 1;
	}
}
