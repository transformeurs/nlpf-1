import { ChangeEvent, ComponentType, FC, useState } from "react";
import classNames from "../utils/classNames";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

export enum InputType {
	TEXT,
	PASSWORD,
	EMAIL
}

export interface InputProps {
	type: InputType;
	name: string;
	id: string;
	value?: string;
	defaultValue?: string;
	placeholder?: string;
	prefix?: string;
	prefixSize?: string;
	suffix?: string;
	suffixSize?: string;
	leftIcon?: ComponentType<{ className?: string }>;
	rightIcon?: ComponentType<{ className?: string }>;
	disabled?: boolean;
	errorFun?: (value: string) => string | null;
	className?: string;
	onChange?: (value: string | null) => void;
}

const Input: FC<InputProps> = ({
	type,
	name,
	id,
	value,
	defaultValue,
	placeholder,
	prefix,
	prefixSize,
	suffix,
	suffixSize,
	leftIcon: LeftIcon,
	rightIcon: RightIcon,
	disabled,
	errorFun,
	className,
	onChange
}) => {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const inputType = {
		[InputType.TEXT]: "text",
		[InputType.PASSWORD]: "password",
		[InputType.EMAIL]: "email"
	}[type];

	return (
		<div>
			<div className="relative mt-1 rounded-md shadow-sm">
				<div
					className={classNames(
						"pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm",
						errorMessage ? "text-red-500" : "text-gray-400"
					)}
				>
					{LeftIcon && <LeftIcon className="h-5 w-5" aria-hidden="true" />}
					{prefix}
				</div>
				<input
					type={inputType}
					name={name}
					id={id}
					value={value}
					defaultValue={defaultValue}
					className={classNames(
						"block w-full rounded-md shadow-sm sm:text-sm",
						"bg-white disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 dark:bg-gray-700",
						errorMessage
							? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500"
							: "border-gray-300 text-black focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:text-gray-300",
						prefixSize ? prefixSize : LeftIcon && "pl-10",
						suffixSize ? suffixSize : RightIcon && "pr-10",
						className
					)}
					placeholder={placeholder}
					disabled={disabled}
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						if (errorFun && errorFun(e.target.value)) {
							setErrorMessage(errorFun(e.target.value));
							onChange && onChange(null);
						} else {
							setErrorMessage(null);
							onChange && onChange(e.target.value);
						}
					}}
				/>
				<div
					className={classNames(
						"pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-sm",
						errorMessage ? "text-red-500" : "text-gray-400"
					)}
				>
					<span className="mr-2">{suffix}</span>
					{errorMessage && (
						<ExclamationCircleIcon className="h-5 w-5" aria-hidden="true" />
					)}
					{RightIcon && <RightIcon className="h-5 w-5" aria-hidden="true" />}
				</div>
			</div>
			{errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
		</div>
	);
};

export default Input;
