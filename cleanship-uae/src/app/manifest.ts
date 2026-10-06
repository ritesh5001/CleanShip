import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.brand,
    short_name: "Cleanship",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#06203a",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
