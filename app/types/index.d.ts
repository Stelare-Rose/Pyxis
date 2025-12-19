export { };

declare global {
	interface Item {
		type: "Task" | "Event" | null;
		id: string,
		name: string;
		path?: string;
		status?: "Todo" | "Doing" | "Done" | "Scheduled";
		endDate?: DateTime;
		startDate?: DateTime;
		priorityDate?: DateTime;
		completedDate?: DateTime;
		afterTask?: string[];
		tags?: Tag[];
		fingerprint: string;
		description?: string;
	}
	interface ItemRow {
		type: "Task" | "Event" | null;
		id: string,
		name: string;
		path: string;
		status?: "Todo" | "Doing" | "Done" | "Scheduled";
		endDate?: DateTime;
		startDate?: DateTime;
		priorityDate?: DateTime;
		completedDate?: DateTime;
		afterTask?: string[];
		// Tags is a string here because we parse it later.
		tags?: string;
		fingerprint: string;
	}
	interface WriteTags {
		tags: Record<string, writeTag>;
	}
	interface WriteTag{
		tag: string;
		color: string[];
	}
	interface Tag {
		id: string;
		tag: string;
		color: string[];
	}
	interface TagRow {
		id: string;
		tag: string;
		color: string;
	}
}
