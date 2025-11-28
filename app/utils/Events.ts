export const ReloadDatabase = () =>{
	SendDatabaseBus("reload");
}

export const ShowTaskModal = (item?: Item) => {
	if(item){
		SendTaskModalBus('item', item);
	}
	SendTaskModalBus('active', true);
}

export const HideTaskModal = () => {
	SendTaskModalBus('active', false);
}
