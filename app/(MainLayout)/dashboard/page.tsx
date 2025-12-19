import DashboardMain from "@/components/dashboard/DashboardMain";
import LayoutWrap from "@/components/layout-wrap";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your business from the UniTide dashboard",

  openGraph: {
    title: "Dashboard",
    description: "Manage your business from the UniTide dashboard",
  },

  twitter: {
    title: "Dashboard",
    description: "Manage your business from the UniTide dashboard",
  },

  alternates: {
    canonical: "/dashboard",
  },
};

const Dashboard = () => {
  return (
    <LayoutWrap>
      <DashboardMain />
    </LayoutWrap>
  );
};

export default Dashboard;
