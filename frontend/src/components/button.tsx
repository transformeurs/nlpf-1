import { ComponentType, FC, RefObject } from "react";
import classNames from "../utils/classNames";
import LoadingIcon from "./loadingIcon";

export enum ButtonType {
	PRIMARY,
	SECONDARY,
	SUCCESS,
	WARNING,
	DANGER
}

export enum ButtonSize {
	XS,
	SM,
	MD,
	LG,
	XL
}

export interface ButtonProps {
	type: ButtonType;
	isSubmit?: boolean;
	size: ButtonSize;
	label: string;
	leftIcon?: ComponentType<{ className?: string }>;
	rightIcon?: ComponentType<{ className?: string }>;
	loading?: boolean;
	disabled?: boolean;
	className?: string;
	forwardedRef?: RefObject<HTMLButtonElement>;
	onClick?: () => void;
}

const Button: FC<ButtonProps> = ({
	type,
	isSubmit,
	size,
	label,
	leftIcon: LeftIcon,
	rightIcon: RightIcon,
	loading,
	disabled,
	className,
	forwardedRef,
	onClick
}) => {
	const buttonType = {
		[ButtonType.PRIMARY]:
			"border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
		[ButtonType.SECONDARY]:
			"border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-gray-800 dark:hover:bg-gray-600",
		[ButtonType.SUCCESS]:
			"border-transparent bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
		[ButtonType.WARNING]:
			"border-transparent bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-400",
		[ButtonType.DANGER]:
			"border-transparent bg-red-500 text-white hover:bg-red-600 focus:ring-red-400"
	}[type];

	const buttonSize = {
		[ButtonSize.XS]: "px-2.5 py-1.5 text-xs",
		[ButtonSize.SM]: "px-3 py-2 text-sm",
		[ButtonSize.MD]: "px-4 py-2 text-sm",
		[ButtonSize.LG]: "px-4 py-2 text-base",
		[ButtonSize.XL]: "px-6 py-3 text-base"
	}[size];

	return (
		<button
			type={isSubmit ? "submit" : "button"}
			className={classNames(
				"inline-flex items-center justify-center rounded border font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2",
				disabled
					? "cursor-not-allowed border-transparent bg-gray-400 text-white dark:bg-gray-600"
					: buttonType,
				loading && "cursor-wait",
				buttonSize,
				className
			)}
			disabled={disabled}
			onClick={() => {
				if (loading) return;
				onClick && onClick();
			}}
			ref={forwardedRef}
		>
			{LeftIcon ? (
				loading ? (
					<LoadingIcon className="mr-2 h-5 w-5" />
				) : (
					<LeftIcon className="mr-1.5 h-6 w-6" />
				)
			) : (
				loading && <LoadingIcon className="mr-2 h-5 w-5" />
			)}
			{label}
			{RightIcon &&
				(loading ? (
					<LoadingIcon className="ml-2 h-5 w-5" />
				) : (
					<RightIcon className="ml-1.5 h-6 w-6" />
				))}
		</button>
	);
};

export default Button;
