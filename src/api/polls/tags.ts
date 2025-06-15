import type { Tag } from "@jocasta-polls-api";
import type { AxiosResponse } from "axios";
import { axiosPollsInstance } from "../axios";

export const getTags = async (): Promise<Tag[]> => {
	try {
		const response: AxiosResponse<Tag[]> =
			await axiosPollsInstance.get("/tags");
		return response.data;
	} catch (error) {
		console.error("Error fetching tags:", error);
		throw error;
	}
};
