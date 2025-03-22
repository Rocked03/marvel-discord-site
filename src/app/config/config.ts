import dotenv from "dotenv";

dotenv.config();

const config = {
	inviteUrl: process.env.INVITE_URL,
	postOfficeInviteUrl: process.env.POST_OFFICE_INVITE_URL,
} as const;

export default config;
