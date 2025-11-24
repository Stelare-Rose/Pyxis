const colors = useColors();
type PastelKey = keyof typeof colors.pastel;
type TextKey = keyof typeof colors.text;

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
