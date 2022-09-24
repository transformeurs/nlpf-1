import { FC, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NotificationStatus, useNotification } from "../context/NotificationContext";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface NotificationsProps {}

interface NotificationProps {
    status: NotificationStatus;
    message: string;
    removeFun: () => void;
}

const Notification: FC<NotificationProps> = ({ status, message, removeFun }) => {
    useEffect(() => {
        const interval = setTimeout(removeFun, 6000);
        return () => {
            clearTimeout(interval);
        };
    }, []);

    return (
        <motion.div
            className="flex justify-center"
            key={"123"}
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 1 } }}
        >
            <div className="w-fit rounded-lg bg-gray-800 px-3 py-2 text-lg font-medium text-white">
                {status === NotificationStatus.Success ? (
                    <div className="flex items-center text-green-100">
                        <CheckIcon className="mr-2 h-5 w-5" /> {message}
                    </div>
                ) : status === NotificationStatus.Error ? (
                    <div className="flex items-center text-red-100">
                        <XMarkIcon className="mr-2 h-5 w-5" /> {message}
                    </div>
                ) : (
                    message
                )}
            </div>
        </motion.div>
    );
};

const Notifications: FC<NotificationsProps> = ({}) => {
    const { notifications, removeNotification } = useNotification();

    return (
        <div className="fixed bottom-4 flex w-full justify-center">
            <div className="space-y-2">
                <AnimatePresence>
                    {notifications.map((notification) => (
                        <Notification
                            key={notification.id}
                            status={notification.status}
                            message={notification.message}
                            removeFun={() => {
                                removeNotification(notification.id);
                            }}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Notifications;
