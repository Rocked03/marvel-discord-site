import { redirect } from "next/navigation";
import config from "../config/config";

export default function InvitePage() {
  redirect(config.inviteUrl || "/");
}
