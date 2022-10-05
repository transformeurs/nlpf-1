import { FC, Fragment, ReactNode, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon, InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Button, { ButtonSize, ButtonType } from "./button";
import classNames from "../utils/classNames";

export enum ModalType {
	SIMPLE,
	CENTERED
}

export enum ModalIcon {
	SUCCESS,
	ERROR,
	INFORMATION
}

export interface ModalProps {
	type: ModalType;
	icon: ModalIcon;
	title: string;
	open: boolean;
	setOpen: (open: boolean) => void;
	buttons: { type: ButtonType; label: string; initialFocus?: boolean; onClick: () => void }[];
	children: ReactNode;
}

const Modal: FC<ModalProps> = ({ type, icon, title, open, setOpen, buttons, children }) => {
	const focusButtonRef = useRef(null);

	const modalIcon = {
		[ModalIcon.SUCCESS]: [
			<CheckIcon className="h-6 w-6 text-green-400 dark:text-green-100" />,
			"bg-green-100 dark:bg-green-600"
		],
		[ModalIcon.ERROR]: [
			<XMarkIcon className="h-6 w-6 text-red-500 dark:text-red-100" />,
			"bg-red-100 dark:bg-red-600"
		],
		[ModalIcon.INFORMATION]: [
			<InformationCircleIcon className="h-6 w-6 text-blue-500 dark:text-blue-100" />,
			"bg-blue-100 dark:bg-blue-600"
		]
	}[icon];

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog
				as="div"
				className="relative z-10"
				initialFocus={focusButtonRef}
				onClose={setOpen}
			>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-gray-900 dark:bg-opacity-75" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
								<div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
									<button
										type="button"
										className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
										onClick={() => setOpen(false)}
									>
										<XMarkIcon className="h-6 w-6" aria-hidden="true" />
									</button>
								</div>
								<div>
									<div
										className={classNames(
											modalIcon[1] as string,
											"mx-auto flex h-12 w-12 items-center justify-center rounded-full"
										)}
									>
										{modalIcon[0]}
									</div>
									<div className="mt-3 text-center sm:mt-5">
										<Dialog.Title
											as="h3"
											className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
										>
											{title}
										</Dialog.Title>
										<div className="mt-2">{children}</div>
									</div>
								</div>
								<div className="mt-5 flex space-x-2 sm:mt-6">
									{buttons.map((button, buttonIdx) => {
										return (
											<Button
												key={buttonIdx}
												type={button.type}
												size={ButtonSize.MD}
												label={button.label}
												onClick={button.onClick}
												className={
													type === ModalType.CENTERED ? "w-full" : ""
												}
												forwardedRef={
													button.initialFocus ? focusButtonRef : undefined
												}
											/>
										);
									})}
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

export default Modal;
