export { };

declare global {
	interface Item {
		type?: "Task" | "Event";
		id: string;
		name?: string;
		status?: "Todo" | "Doing" | "Done" | "Scheduled";
		endDate?: DateTime;
		startDate?: DateTime;
		afterTask?: string[];
		tags?: string[];
	}
	interface IndexItem {
		type?: "Task" | "Event" | null;
		id: string,
		name?: string;
		path?: string;
		status?: string;
		endDate?: DateTime;
		startDate?: DateTime;
		priorityDate?: DateTime;
		afterTask?: string[];
		tags?: Tag[];
		description?: string;
	}
	interface IndexRow {
		type: "Task" | "Event" | null;
		id?: string,
		name?: string;
		path?: string;
		status?: string;
		endDate?: DateTime;
		startDate?: DateTime;
		priorityDate?: DateTime;
		afterTask?: string[];
		tags?: string;
	}
	interface Tag {
		id: string;
		tag: string;
		color: string[];
	}
	interface TagRow {
		id: string;
		name: string;
		color: string;
	}
}
