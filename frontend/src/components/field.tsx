import { FC, ReactNode } from "react";

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
