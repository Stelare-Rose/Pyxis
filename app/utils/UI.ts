const colors = useColors();
export type PastelKey = keyof typeof colors.pastel;
export type TextKey = keyof typeof colors.text;

// Takes a Tag, Returns an Array of Tag Colours, Translated.
export const getTagColor: (t: Tag) => string[] = (t: Tag) => {
	return t.color
	.filter((x): x is PastelKey => x in colors.pastel)
	.map((x: PastelKey) => colors.pastel[x]);
}
export const getTagTextColor: (t: Tag) => string[] = (t: Tag) => {
	return t.color
	.filter((x): x is TextKey => x in colors.text)
	.map((x: TextKey) => colors.text[x]);
}
// Takes a string delimited by , and returns an array of colours, translated.
export const getRawColor: (s: string) => string[] = (s: string) => {
	return s.split(',')
	.filter((x): x is PastelKey => x in colors.pastel)
	.map((x: PastelKey) => colors.pastel[x]);
}
export const getRawTextColor: (s: string) => string[] = (s: string) => {
	return s.split(',')
	.filter((x): x is TextKey => x in colors.text)
	.map((x: TextKey) => colors.text[x]);
}
// Returns Colour of Status
export const getStatusColor: (status: string) => string[] = (status: string) => {
	switch(status){
		case 'Todo':
			return [colors.pastel.strawberry, colors.pastel.strawberry];
		case 'Doing':
			return [colors.pastel.orange, colors.pastel.orange];
		case 'Scheduled':
			return [colors.pastel.blueberry, colors.pastel.blueberry];
		case 'Done':
			return [colors.pastel.leaf, colors.pastel.leaf];
		case 'Pending':
			return [colors.pastel.lilac, colors.pastel.lilac];
		default:
			return [colors.text_1, colors.subtext_2];
	}
}
export const getStatusTextColor: (status: string) => string[] = (status: string) => {
	switch(status){
		case 'Todo':
			return [colors.text.strawberry, colors.text.strawberry];
		case 'Doing':
			return [colors.text.orange, colors.text.orange];
		case 'Scheduled':
			return [colors.text.blueberry, colors.text.blueberry];
		case 'Done':
			return [colors.text.leaf, colors.text.leaf];
		case 'Pending':
			return [colors.text.lilac, colors.text.lilac];
		default:
			return [colors.text_1, colors.subtext_2];
	}
}
