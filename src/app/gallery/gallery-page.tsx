"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GalleryPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("./logo");
  }, [router]);

  return null;
}
