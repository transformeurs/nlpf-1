import React, { FC, ReactNode } from "react";
import classNames from "../utils/classNames";
import { Fragment } from "react";
import { Menu, Popover, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { BellIcon, XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { BriefcaseIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { AuthorizationRole, useAuth } from "../context/AuthContext";

interface LayoutProps {
    breadcrumbs?: {
        label: string;
        href: string;
    }[];
    children: ReactNode;
}

const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Offres", href: "/offers" },
    { name: "Candidatures", href: "/candidacies" }
];

const Layout: FC<LayoutProps> = ({ breadcrumbs, children }) => {
    const router = useRouter();
    const { user, disconnect } = useAuth({ requiredRole: AuthorizationRole.All });

    const userNavigation = [
        {
            name: "Déconnexion",
            fun: () => disconnect(),
        }
    ];

    return (
        <div className="min-h-full">
            <Popover as="header" className="bg-indigo-700 pb-24">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 lg:max-w-7xl lg:px-8 lg:py-0">
                            <div className="relative flex items-center justify-center py-5 lg:justify-between">
                                {/* Logo */}
                                <Link href="/">
                                    <div className="cursor-pointer absolute left-0 flex flex-shrink-0 select-none items-center text-lg font-semibold hover:opacity-75 transition duration-400 ease-in-out lg:static">
                                        <BriefcaseIcon className="mr-2 h-8 w-8 text-indigo-300" />
                                        <span className="text-white">Job</span>
                                        <span className="text-indigo-300">Board</span>
                                    </div>
                                </Link>

                                {/* Navigation */}
                                <div className="hidden items-baseline space-x-4 lg:flex">
                                    {navigation.map((item, itemIdx) => (
                                        <Link key={itemIdx} href={item.href}>
                                            <div
                                                className={classNames(
                                                    router.pathname === item.href
                                                        ? "text-white underline underline-offset-4"
                                                        : "text-gray-300 hover:bg-indigo-600 hover:text-white",
                                                    "cursor-pointer rounded-md px-3 py-2 text-sm font-medium"
                                                )}
                                            >
                                                {item.name}
                                            </div>
                                        </Link>
                                    ))}
                                    {!user && (
                                        <Link href="/signup">
                                            <div className="cursor-pointer text-gray-300 border border-gray-300 hover:bg-indigo-600 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                                                S'inscrire
                                            </div>
                                        </Link>
                                    )}
                                </div>

                                {/* Right section on desktop, only if connected */}
                                {user && (
                                    <div className="hidden lg:ml-4 lg:flex lg:items-center lg:pr-0.5">
                                        <button
                                            type="button"
                                            className="flex-shrink-0 rounded-full p-1 text-indigo-200 hover:bg-white hover:bg-opacity-10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                        >
                                            <BellIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>

                                        {/* Profile dropdown */}
                                        <Menu as="div" className="relative ml-4 flex-shrink-0">
                                            <div>
                                                <Menu.Button className="flex rounded-full bg-white text-sm ring-2 ring-white ring-opacity-20 focus:outline-none focus:ring-opacity-100">
                                                    <img
                                                        className="h-8 w-8 rounded-full"
                                                        src={user?.avatarUrl}
                                                        alt=""
                                                    />
                                                </Menu.Button>
                                            </div>
                                            <Transition
                                                as={Fragment}
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="absolute -right-2 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    {userNavigation.map((item) => (
                                                        <Menu.Item key={item.name}>
                                                            {({ active }) => (
                                                                <button
                                                                    className={classNames(
                                                                        active ? "bg-gray-100" : "",
                                                                        "block w-full px-4 py-2 text-left text-sm text-gray-700"
                                                                    )}
                                                                    onClick={item.fun}
                                                                >
                                                                    {item.name}
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                    ))}
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </div>
                                )}
                                {/* Menu button */}
                                <div className="absolute right-0 flex-shrink-0 lg:hidden">
                                    {/* Mobile menu button */}
                                    <Popover.Button className="inline-flex items-center justify-center rounded-md bg-transparent p-2 text-indigo-200 hover:bg-white hover:bg-opacity-10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon
                                                className="block h-6 w-6"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <Bars3Icon
                                                className="block h-6 w-6"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </Popover.Button>
                                </div>
                            </div>
                            <div className="hidden border-t border-white border-opacity-20 py-8 lg:block">
                                {breadcrumbs && (
                                    <div className="mx-auto flex max-w-7xl items-center space-x-2 px-4 sm:px-6 lg:px-8">
                                        {breadcrumbs.map((breadcrumb, breadcrumbIdx) => {
                                            if (breadcrumbIdx < breadcrumbs.length - 1) {
                                                return (
                                                    <div
                                                        key={breadcrumb.label}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <Link href={breadcrumb.href}>
                                                            <h2 className="cursor-pointer text-xl text-indigo-300 hover:text-white">
                                                                {breadcrumb.label}
                                                            </h2>
                                                        </Link>
                                                        <ChevronRightIcon className="h-5 w-5 text-indigo-500" />
                                                    </div>
                                                );
                                            } else {
                                                return (
                                                    <h1
                                                        key={breadcrumb.label}
                                                        className="text-2xl font-bold text-indigo-100"
                                                    >
                                                        {breadcrumb.label}
                                                    </h1>
                                                );
                                            }
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        <Transition.Root as={Fragment}>
                            <div className="lg:hidden">
                                <Transition.Child
                                    as={Fragment}
                                    enter="duration-150 ease-out"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="duration-150 ease-in"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Popover.Overlay className="fixed inset-0 z-20 bg-black bg-opacity-25" />
                                </Transition.Child>

                                <Transition.Child
                                    as={Fragment}
                                    enter="duration-150 ease-out"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="duration-150 ease-in"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Popover.Panel
                                        focus
                                        className="absolute inset-x-0 top-0 z-30 mx-auto w-full max-w-3xl origin-top transform p-2 transition"
                                    >
                                        <div className="divide-y divide-gray-200 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                            <div className="pt-3 pb-2">
                                                <div className="flex items-center justify-between px-4">
                                                    <div className="flex select-none items-center font-semibold">
                                                        <BriefcaseIcon className="mr-2 h-8 w-8 text-indigo-500" />
                                                        <span className="text-indigo-900">Job</span>
                                                        <span className="text-indigo-500">
                                                            Board
                                                        </span>
                                                    </div>
                                                    <div className="-mr-2">
                                                        <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                                            <span className="sr-only">
                                                                Close menu
                                                            </span>
                                                            <XMarkIcon
                                                                className="h-6 w-6"
                                                                aria-hidden="true"
                                                            />
                                                        </Popover.Button>
                                                    </div>
                                                </div>
                                                <div className="mt-3 space-y-1 px-2">
                                                    {navigation.map((item, itemIdx) => (
                                                        <a
                                                            key={itemIdx}
                                                            href="#"
                                                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                                                        >
                                                            {item.name}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* User section, displayed if connected */}
                                            {user && (
                                                <div className="pt-4 pb-2">
                                                    <div className="flex items-center px-5">
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                className="h-10 w-10 rounded-full"
                                                                src={user?.avatarUrl}
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className="ml-3 min-w-0 flex-1">
                                                            <div className="truncate text-base font-medium text-gray-800">
                                                                {user?.name}
                                                            </div>
                                                            <div className="truncate text-sm font-medium text-gray-500">
                                                                {user?.email}
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                        >
                                                            <span className="sr-only">
                                                                View notifications
                                                            </span>
                                                            <BellIcon
                                                                className="h-6 w-6"
                                                                aria-hidden="true"
                                                            />
                                                        </button>
                                                    </div>
                                                    <div className="mt-3 space-y-1 px-2">
                                                        {userNavigation.map((item) => (
                                                            <button
                                                                key={item.name}
                                                                className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                                                                onClick={item.fun}
                                                            >
                                                                {item.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {/* SignUp button, NOT displayed if connected */}
                                            {!user && (
                                                <div className="pt-2 pb-2">
                                                    <div className="space-y-1 px-2">
                                                        <Link href="/signup">
                                                            <div
                                                                className="cursor-pointer block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                                                            >
                                                                S'inscrire
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Popover.Panel>
                                </Transition.Child>
                            </div>
                        </Transition.Root>
                    </>
                )}
            </Popover>

            <main className="-mt-24 pb-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                    {children}
                </div>
            </main>

            <footer>
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                    <div className="border-t border-gray-200 py-8 text-center text-sm text-gray-500 sm:text-left">
                        <span className="block sm:inline">&copy; 2022 JobBoard</span>{" "}
                        <span className="block sm:inline">Tous droits réservés.</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
