import { whatsappUrl } from "@/content/company";
import { site } from "@/content/site";
import { WhatsAppIcon } from "./icons";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappUrl(site.domain)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Cleanship on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg hover:bg-[#1fb857]"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
