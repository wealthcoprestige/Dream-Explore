"use client";

import OpportunityDetailPage from "@/components/LandingPage/OpportunityDetailPage";
import React from "react";

export default function DetailsPageContent() {
  // OpportunityDetailPage uses useSearchParams, so it must be rendered on the client.
  // This wrapper component ensures that the logic is contained within a client boundary.
  return <OpportunityDetailPage />;
}
