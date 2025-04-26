import type { Meta, Poll } from "@jocasta-polls-api";
import { axiosPollsInstance } from "../axios";
import type { AxiosResponse } from "axios";

export const getPolls = async (): Promise<{ polls: Poll[]; meta: Meta }> => {
	try {
		const params = {
			guildId: "281648235557421056",
		};

		const response: AxiosResponse<{ data: Poll[]; meta: Meta }> =
			await axiosPollsInstance.get("/polls", { params: params });

		return { polls: response.data.data, meta: response.data.meta };
	} catch (error) {
		console.error("Error fetching polls:", error);
		throw error;
	}
};
