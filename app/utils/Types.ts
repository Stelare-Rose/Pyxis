export const isType = (t: any): t is "Task" | "Event" => t === "Task" || t === "Event";
export const isStatus = (s: any): s is "Todo" | "Doing" | "Done" | "Scheduled" => s === "Todo" || s === "Doing" || s === "Done" || s === "Scheduled";
