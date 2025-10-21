import React, { Suspense } from "react";
import DetailsPageContent from "./page-content";

function DetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailsPageContent />
    </Suspense>
  );
}

export default DetailsPage;
