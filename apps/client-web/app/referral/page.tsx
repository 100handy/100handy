import { getPageContent, getPageSeoMetadata } from "@/lib/cms";
import ReferralClient from "./referral-client";

export async function generateMetadata() {
  return getPageSeoMetadata("referral", {
    title: "Referral | 100 Handy",
    description: "Invite friends to 100 Handy and earn referral credit.",
  });
}

export default async function ReferralPage() {
  const c = await getPageContent("referral");

  return (
    <ReferralClient
      title={c("hero.title", "Help Your Friends, Get £10")}
      description={c("hero.description", "Refer a friend to 100Handy. They get £10 off their first task. You get £10 off when they complete it.")}
      emailPlaceholder={c("hero.email_placeholder", "Enter email address")}
      sendInviteText={c("hero.send_invite_text", "Send Invite")}
      emailHelpText={c("hero.email_help_text", "Separate email recipients with commas (eg: friend1@gmail.com, friend2@gmail.com)")}
      copyButtonText={c("hero.copy_button_text", "Copy link")}
      copiedButtonText={c("hero.copied_button_text", "Copied!")}
    />
  );
}
