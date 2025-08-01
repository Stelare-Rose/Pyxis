export { Item };

declare global {
	interface Item {
		type: "Task" | "Event" | null;
		id: string;
		name: string;
		status: "Todo" | "Doing" | "Done" | "Scheduled" | null;
		hardDeadline?: DateTime;
		softDeadline?: DateTime;
		afterTask?: string[];
		tags?: string[];
	}
}
