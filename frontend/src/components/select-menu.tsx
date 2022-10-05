import { FC, Fragment, useEffect, useState } from "react";
import classNames from "../utils/classNames";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

type ValueType = {
	key: string;
	category?: string;
	label: string;
	subLabel?: string;
	imageUrl?: string;
};

export interface SelectMenuProps {
	id: string;
	name: string;
	value?: string | null;
	defaultValue?: string | null;
	values: ValueType[];
	className?: string;
	onChange?: (value: string | null) => void;
}

const SelectMenu: FC<SelectMenuProps> = ({
	id,
	name,
	value,
	defaultValue,
	values,
	className,
	onChange
}) => {
	const [selected, setSelected] = useState(
		defaultValue ? values.find((v) => v.key === defaultValue) : values[0]
	);

	useEffect(() => {
		onChange && onChange(selected ? selected.key : null);
	}, [selected]);

	return (
		<Listbox value={selected} onChange={setSelected}>
			{({ open }) => (
				<div className="relative mt-1">
					<Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-700 sm:text-sm">
						{selected && (
							<span className="inline-flex w-full truncate">
								<span className="truncate">{selected.label}</span>
								<span className="ml-2 truncate text-gray-500 dark:text-gray-400">
									{selected.subLabel}
								</span>
							</span>
						)}
						<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
							<ChevronUpDownIcon
								className="h-5 w-5 text-gray-400"
								aria-hidden="true"
							/>
						</span>
					</Listbox.Button>

					<Transition
						show={open}
						as={Fragment}
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700 sm:text-sm">
							{values.map((value) => (
								<Listbox.Option
									key={value.key}
									className={({ active }) =>
										classNames(
											active
												? "bg-blue-600 text-white"
												: "text-gray-900 dark:text-gray-100",
											"relative cursor-default select-none py-2 pl-3 pr-9"
										)
									}
									value={value}
								>
									{({ selected, active }) => (
										<>
											<div className="flex">
												<span
													className={classNames(
														selected ? "font-semibold" : "font-normal",
														"truncate"
													)}
												>
													{value.label}
												</span>
												<span
													className={classNames(
														active
															? "text-blue-200"
															: "text-gray-500 dark:text-gray-400",
														"ml-2 truncate"
													)}
												>
													{value.subLabel}
												</span>
											</div>

											{selected ? (
												<span
													className={classNames(
														active ? "text-white" : "text-blue-600",
														"absolute inset-y-0 right-0 flex items-center pr-4"
													)}
												>
													<CheckIcon
														className="h-5 w-5"
														aria-hidden="true"
													/>
												</span>
											) : null}
										</>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>
				</div>
			)}
		</Listbox>
	);
};

export default SelectMenu;
