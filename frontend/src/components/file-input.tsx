import React from "react";
import classNames from "../utils/classNames";
import Button, { ButtonSize, ButtonType } from "./button";

export interface FileInputProps {
    className?: string;
    accept?: string;
}

// We use forwardRef to expose the ref to the hidden file input
const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>((props, inputRef) => {
    // Create a reference to the span filename element
    // const hiddenFileInput = React.useRef<HTMLInputElement>(null);
    const fileName = React.useRef<HTMLSpanElement>(null);

    // Programatically click the hidden file input element
    // when the Button component is clicked
    const handleFileClick = () => {
        (inputRef as React.MutableRefObject<HTMLInputElement>).current.click();
    };

    // Update the text for the file input
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileUploaded = event.target.files?.[0];
        fileName.current!.textContent = fileUploaded?.name || "";
    };

    return (
        <div className={classNames(props.className)}>
            <div>
                <Button
                    type={ButtonType.SECONDARY}
                    size={ButtonSize.MD}
                    label={"Choisir un fichier"}
                    onClick={handleFileClick}
                />
                <span ref={fileName} className="text-s ml-3 text-gray-600">
                    Aucun fichier choisi
                </span>
            </div>
            {/* Hidden file input, handled by the Button component */}
            <input
                type="file"
                ref={inputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept={props.accept}
            />
        </div>
    );
});

export default FileInput;
