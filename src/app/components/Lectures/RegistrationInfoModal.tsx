import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CountStamp, RegistrationInfo } from "./Inner";

interface RegistrationInfoModalProps {
  registrationInfo?: RegistrationInfo;
  onClose: () => void;
}

const RegistrationInfoModal = ({
  registrationInfo,
  onClose: propOnClose,
}: RegistrationInfoModalProps) => {
  const [open, setOpen] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const onClose = () => {
    setOpen(false);
    setTimeout(propOnClose, 500);
  };

  useEffect(() => {
    if (!registrationInfo) return;
    setShowOriginal(false);
    setOpen(true);
  }, [registrationInfo]);

  if (!registrationInfo) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-10 bg-black bg-opacity-50 transition-opacity duration-500 ${
        open ? "opacity-100" : "pointer-events-none select-none opacity-0"
      }`}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      onClick={(e) => {
        onClose();
        e.stopPropagation();
      }}
      tabIndex={-1}
    >
      <div className="absolute w-screen ">
        <div className="box-border flex h-screen w-screen items-center justify-center md:p-8">
          <div
            className="flex max-h-full max-w-full animate-bottomUp flex-col bg-white p-2 shadow-lg dark:bg-neutral-800 md:rounded-lg md:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <LineChart
              width={800}
              height={400}
              data={registrationInfo.countStamps}
            >
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <Line type="monotone" dataKey={"count"} stroke="#8884d8" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, registrationInfo.capacity]} />
              <Tooltip />
            </LineChart>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default RegistrationInfoModal;
