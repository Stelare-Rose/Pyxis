export const ItemToPlainTextRow = (name: string, property?: string) => {
	if(!property || property.length < 1) return '';
	return `[${name}]:${property}\n`;
}
