import type { Metadata } from "next";
import { MechatronicsProjectPage } from "@/components/mechatronics/MechatronicsProjectPage";

export const metadata: Metadata = {
  title: "Autonomous Bartending Robot | Joseph-Paul Marhefka",
  description:
    "A first-place mechatronics competition robot using Arduino Mega 2560, PID line following, a C++ state machine, sensors, and servo actuation to pull bar taps autonomously.",
};

export default function MechatronicsRobotPage() {
  return (
    <main>
      <MechatronicsProjectPage />
    </main>
  );
}
