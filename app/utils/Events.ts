export const ReloadDatabase = () =>{
	SendDatabaseBus("reload");
}

export const ShowTaskModal = (item?: Item) => {
	SendTaskModalBus('active', true);
	if(item){
		SendTaskModalBus('item', item);
	}
}

export const HideTaskModal = () => {
	SendTaskModalBus('active', false);
}
