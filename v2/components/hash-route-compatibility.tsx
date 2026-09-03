"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function HashRouteCompatibility() {
  const router = useRouter();

  useEffect(() => {
    if (window.location.hash === "#/deat_aka") router.replace("/deat_aka");
  }, [router]);

  return null;
}
