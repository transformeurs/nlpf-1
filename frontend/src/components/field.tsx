import { ComponentType, FC, ReactElement, ReactNode, useEffect, useState } from "react";
import { Fragment } from "react";
import { Menu, Popover, Transition } from "@headlessui/react";
import classNames from "../utils/classNames";
import {
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    BellIcon,
    Cog6ToothIcon,
    ComputerDesktopIcon,
    HomeIcon,
    LifebuoyIcon,
    MagnifyingGlassIcon,
    MoonIcon,
    StarIcon,
    SunIcon,
    UserIcon,
    UsersIcon,
    WalletIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { FireIcon } from "@heroicons/react/24/solid";
import { useTheme } from "next-themes";
import { IconType } from "recharts/types/component/DefaultLegendContent";
import LoadingIcon from "./loadingIcon";

export interface FieldProps {
    label: string;
    optional?: boolean;
    children: ReactNode;
}

const Field: FC<FieldProps> = ({ label, optional, children }) => {
    return (
        <div>
            <div className="flex justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
                {optional && <span className="text-sm text-gray-500">Optionnel</span>}
            </div>
            <div className="mt-1">{children}</div>
        </div>
    );
};

export default Field;
