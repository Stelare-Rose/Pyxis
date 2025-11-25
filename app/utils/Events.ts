import mitt from "mitt";
export const TaskModalBus = mitt<{active: boolean, item: Item}>();

export const ReloadDatabase = () =>{
	console.log("Detected Reload!");
	SendDatabaseBus("reload");
}

export const ShowTaskModal = (item?: Item) => {
	if(item){
		TaskModalBus.emit('item', item);
	}
	TaskModalBus.emit('active', true);
}

export const HideTaskModal = () => {
	TaskModalBus.emit('active', false);
}
