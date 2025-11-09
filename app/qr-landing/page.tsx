"use client";

import { useEffect } from "react";

export default function QRLandingPage() {
  useEffect(() => {
    // Trigger vCard download
    const downloadVCard = () => {
      const link = document.createElement("a");
      link.href = "/aldgar-contact.vcf"; // Path to the vCard file
      link.download = "Aldgar-Contact.vcf";
      link.click();
    };

    downloadVCard();

    // Redirect to portfolio after a delay
    const redirectTimeout = setTimeout(() => {
      window.location.href = "https://aldgar.dev"; // Replace with your portfolio URL
    }, 5000); // Increased delay to 5 seconds for better UI experience

    return () => clearTimeout(redirectTimeout);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Adding Contact Details...</h1>
      <p>
        Your contact details are being added. You will be redirected to the
        portfolio shortly.
      </p>
    </div>
  );
}
