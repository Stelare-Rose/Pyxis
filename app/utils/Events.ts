import mitt from "mitt";
export const DatabaseBus = mitt<{reload: void}>();
export const TaskModalBus = mitt<{active: boolean}>();

export const ReloadDatabase = () =>{
	DatabaseBus.emit('reload');
}

export const ShowTaskModal = () => {
	TaskModalBus.emit('active', true);
}

export const HideTaskModal = () => {
	TaskModalBus.emit('active', false);
}
