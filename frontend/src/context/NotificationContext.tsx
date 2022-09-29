import * as React from "react";
import { FC, useReducer } from "react";
import { v4 } from "uuid";

enum NotificationStatus {
    Success,
    Error,
    Info
}

type Notification = {
    id: number;
    status: NotificationStatus;
    message: string;
};

const NotificationsContext = React.createContext<
    { notifications: Notification[]; addNotification: any; removeNotification: any } | undefined
>(undefined);

interface NotificationsProviderProps {
    children: React.ReactNode;
}

const NotificationsProvider: FC<NotificationsProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer((state: any, action: any) => {
        switch (action.type) {
            case "ADD_NOTIFICATION":
                return [...state, { id: v4(), status: action.status, message: action.message }];
            case "REMOVE_NOTIFICATION":
                return state.filter((n: Notification) => n.id !== action.id);
            default:
                return state;
        }
    }, []);
    const value = {
        notifications: state,
        addNotification: (status: NotificationStatus, message: string) =>
            dispatch({ type: "ADD_NOTIFICATION", status, message }),
        removeNotification: (id: number) => dispatch({ type: "REMOVE_NOTIFICATION", id })
    };
    return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

function useNotification() {
    const context = React.useContext(NotificationsContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationsContext");
    }
    return context;
}

export { NotificationsProvider, useNotification, NotificationStatus };
