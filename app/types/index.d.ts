export { colors };

declare global {
	interface Item {
		type?: "Task" | "Event";
		id: string;
		name?: string;
		status?: "Todo" | "Doing" | "Done" | "Scheduled";
		hardDeadline?: DateTime;
		softDeadline?: DateTime;
		afterTask?: string[];
		tags?: string[];
	}
	interface IndexItem {
		type?: "Task" | "Event" | null;
		id: string,
		name?: string;
		path?: string;
		status?: string;
		hardDeadline?: DateTime;
		softDeadline?: DateTime;
		afterTask?: string[];
		tags?: Tag[];
	}
	interface IndexRow {
		type: "Task" | "Event" | null;
		id?: string,
		name?: string;
		path?: string;
		status?: string;
		hardDeadline?: DateTime;
		softDeadline?: DateTime;
		afterTask?: string[];
		tags?: string;
	}
	interface Tag {
		tag: string;
		color: string[];
	}
	interface TagRow {
		tag: string;
		color: string;
	}
}
