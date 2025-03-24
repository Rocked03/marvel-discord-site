export const formatDate = (date: Date): string => {
	return new Intl.DateTimeFormat("en-US", {
		month: "long",
		year: "numeric",
	}).format(date);
};
