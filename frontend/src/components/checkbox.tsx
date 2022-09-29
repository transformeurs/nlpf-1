import { FC, ReactNode } from "react";
import classNames from "classnames";

export interface CheckboxProps {
	id: string;
	name: string;
	value?: boolean;
	className?: string;
	onChange?: (value: boolean) => void;
	children?: ReactNode;
}

const Checkbox: FC<CheckboxProps> = ({ id, name, value, className, onChange, children }) => {
	return (
		<div
			className={classNames(
				"relative flex w-fit cursor-pointer select-none items-start",
				className
			)}
		>
			<div className="flex h-5 items-center">
				<input
					id={id}
					name={name}
					type="checkbox"
					checked={value !== null ? value : undefined}
					className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					onChange={(e) => onChange?.(e.target.checked)}
				/>
			</div>
			<label htmlFor={name} className="cursor-pointer">
				{children}
			</label>
		</div>
	);
};

export default Checkbox;
