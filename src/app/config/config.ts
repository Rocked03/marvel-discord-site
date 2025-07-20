import dotenv from "dotenv";

dotenv.config();

const config = {
	publicBaseUrl: process.env.PUBLIC_BASE_URL,
	inviteUrl: process.env.INVITE_URL,
	postOfficeInviteUrl: process.env.POST_OFFICE_INVITE_URL,
	apiUrlPolls: process.env.NEXT_PUBLIC_API_URL_POLLS,
} as const;

export default config;
