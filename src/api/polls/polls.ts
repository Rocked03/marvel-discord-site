import type { Meta, Poll } from "@jocasta-polls-api";
import { axiosPollsInstance } from "../axios";
import type { AxiosResponse } from "axios";

interface GetPollsParams {
	guildId?: string | bigint;
	published?: boolean;
	tag?: number;
	user?: PollFilterUser;
	search?: string;

	page?: number;
	limit?: number;

	signal?: AbortSignal;
}

export interface PollFilterUser {
	userId: bigint;
	notVoted?: boolean;
}

export const getPolls = async ({
	guildId = "281648235557421056",
	published = true,
	tag,
	user,
	search,
	page = 1,
	limit = 10,
	signal,
}: GetPollsParams): Promise<{ polls: Poll[]; meta: Meta }> => {
	try {
		const params = {
			guildId: guildId.toString(),
			published: published,
			tag: tag,
			userId: user ? user.userId.toString() : undefined,
			notVoted: user ? user?.notVoted : undefined,
			search: search,
			page: page,
			limit: limit,
		};

		const response: AxiosResponse<{ data: Poll[]; meta: Meta }> =
			await axiosPollsInstance.get("/polls", { params: params, signal });

		return { polls: response.data.data, meta: response.data.meta };
	} catch (error) {
		console.error("Error fetching polls:", error);
		throw error;
	}
};
