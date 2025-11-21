import mitt from "mitt";
export const DatabaseBus = mitt<{reload: void}>();
export const TaskModalBus = mitt<{active: boolean, item: Item}>();

export const ReloadDatabase = () =>{
	DatabaseBus.emit('reload');
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
