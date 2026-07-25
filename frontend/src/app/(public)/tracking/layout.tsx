import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Shipment – Real-Time Cargo Tracking | Sayona Shipping Services",
  description:
    "Track your shipment in real time with Sayona Shipping Services. Enter your tracking ID or waybill number to get live status updates, location tracking, and estimated delivery times for ocean freight, air cargo, and ground transport.",
};

export default function TrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
