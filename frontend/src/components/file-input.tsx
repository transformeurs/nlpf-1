import { FC } from "react";
import classNames from "../utils/classNames";
import Button, { ButtonSize, ButtonType } from "./button";

export interface FileInputProps {
    className?: string;
}

const FileInput: FC<FileInputProps> = ({ className }) => {
    return (
        <div className={classNames(className)}>
            <div>
                <Button
                    type={ButtonType.SECONDARY}
                    size={ButtonSize.MD}
                    label={"Choisir un fichier"}
                />
                <span className="text-s ml-3 text-gray-600">
                    {/* ref={fileName} */}
                    Aucun fichier choisi
                </span>
            </div>
            {/* Hidden file input, handled by the Button component */}
            <input
                type="file"
                id="photo"
                name="photo"
                // ref={hiddenFileInput}
                style={{ display: "none" }}
                onChange={() => {}}
            />
        </div>
    );
};

export default FileInput;
