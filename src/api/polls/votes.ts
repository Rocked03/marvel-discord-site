import type { Vote } from "@jocasta-polls-api";
import type { AxiosResponse } from "axios";
import { axiosPollsInstance } from "../axios";

export const getUserVotes = async (userId: string): Promise<Vote[]> => {
	try {
		const response: AxiosResponse<Vote[]> = await axiosPollsInstance.get(
			`/polls/votes/${userId}`,
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching user votes:", error);
		throw error;
	}
};
