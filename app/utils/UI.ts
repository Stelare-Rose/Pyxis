const colors = useColors();

export const getTagColor = (t: Tag) => {
		return t.color.map(x => colors.pastel[x as string] as string);
	}
export const getTagTextColor = (t: Tag) => {
		return t.color.map(x => colors.text[x as string] as string);
	}
