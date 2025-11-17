"use client";
import { useViewAlert } from "@/hooks/useNotifications";
import { useParams } from "next/navigation";

const ViewNotificationMain = () => {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useViewAlert(params.id);

  return <div>ViewNotificationMain {params.id}</div>;
};

export default ViewNotificationMain;
