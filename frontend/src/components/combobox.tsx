import { FC, useEffect, useState } from "react";
import { Combobox } from "@headlessui/react";
import classNames from "../utils/classNames";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

type ValueType = {
	key: string;
	category?: string;
	label: string;
	subLabel?: string;
	imageUrl?: string;
};

export interface ComboBoxProps {
	id: string;
	name: string;
	value?: string | null;
	values: ValueType[];
	className?: string;
	onChange?: (value: string | null) => void;
}

const ComboBox: FC<ComboBoxProps> = ({ id, name, value, values, className, onChange }) => {
	const [query, setQuery] = useState("");
	const [selectedValue, setSelectedValue] = useState<ValueType>();

	useEffect(() => {
		if (!value) {
			setSelectedValue(undefined);
		} else {
			setSelectedValue(values.find((v) => v.key === value));
		}
	}, [value]);

	useEffect(() => {
		if (onChange) onChange(selectedValue?.key ?? null);
	}, [selectedValue]);

	const filteredValues =
		query === ""
			? values
			: values.filter((value) => {
					return value.label.toLowerCase().includes(query.toLowerCase());
			  });

	const categories: { name: string | undefined; values: ValueType[] }[] = [];
	filteredValues.forEach((value) => {
		let category = categories.find((category) => category.name === value.category);
		if (!category) {
			categories.push({ name: value.category, values: [value] });
		} else {
			category.values.push(value);
		}
	});

	return (
		<>
			<Combobox as="div" value={selectedValue} onChange={setSelectedValue}>
				<div className="relative">
					{selectedValue && (
						<img
							src={selectedValue?.imageUrl}
							alt=""
							className="absolute left-1.5 top-1.5 h-6 w-6 flex-shrink-0 rounded-full"
						/>
					)}
					<Combobox.Input
						id={id}
						name={name}
						className={classNames(
							selectedValue?.imageUrl ? "pl-9" : "pl-3",
							"w-full rounded-md border border-gray-300 bg-white py-2 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-700 sm:text-sm"
						)}
						onChange={(event) => setQuery(event.target.value)}
						displayValue={(value: ValueType) => value?.label}
					/>
					<Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
						<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
					</Combobox.Button>

					{filteredValues.length > 0 && (
						<Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700 sm:text-sm">
							{categories.map((category, categoryIdx) => (
								<div key={categoryIdx}>
									<div className="bg-gray-100 p-0.5 pl-1 font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
										{category.name}
									</div>
									{category.values.map((value) => (
										<Combobox.Option
											key={value.key}
											value={value}
											className={({ active }) =>
												classNames(
													"relative cursor-default select-none py-2 pl-3 pr-9",
													active
														? "bg-blue-500 text-white"
														: "text-gray-900"
												)
											}
										>
											{({ active, selected }) => (
												<>
													<div className="flex items-center">
														{value.imageUrl && (
															<img
																src={value.imageUrl}
																alt=""
																className="mr-1.5 h-6 w-6 flex-shrink-0 rounded-full"
															/>
														)}

														<span
															className={classNames(
																"truncate text-gray-800 dark:text-gray-200",
																selected && "font-semibold"
															)}
														>
															{value.label}
														</span>
														<span
															className={classNames(
																"ml-2 truncate text-gray-500 dark:text-gray-400",
																active
																	? "text-blue-200"
																	: "text-gray-500"
															)}
														>
															{value.subLabel}
														</span>
													</div>

													{selected && (
														<span
															className={classNames(
																"absolute inset-y-0 right-0 flex items-center pr-4",
																active
																	? "text-white"
																	: "text-blue-600 dark:text-blue-400"
															)}
														>
															<CheckIcon
																className="h-5 w-5"
																aria-hidden="true"
															/>
														</span>
													)}
												</>
											)}
										</Combobox.Option>
									))}
								</div>
							))}
						</Combobox.Options>
					)}
				</div>
			</Combobox>
		</>
	);
};

export default ComboBox;
