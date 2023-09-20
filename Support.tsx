import './Support.css';
import React, { useState, useRef } from 'react';
import { saveSupportInfo, saveSupportAttachments, checkExistingTicketID, validateEmail } from "./validation";
import User from "./user";
import Query from "./query";

function Support() {
    const topicOptions = [
        'Account Issues',
        'Privacy and Security',
        'Content Management',
        'Technical Problems',
        'Messaging and Communication',
        'Feedback and Suggestions',
        'Report Technical Glitches',
        'Other'
    ];
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [description, setDescription] = useState('');
    const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(true);
    const [isTextAreaFocused, setIsTextAreaFocused] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [selectedFileNames, setFileNames] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleItemClick = (item: string) => {
        setSelectedItem(item);
        setIsDropdownOpen(false);
    };

    const handleTextAreaFocus = () => {
        setIsTextAreaFocused(true);
        setIsPlaceholderVisible(false);
    };

    const handleTextAreaBlur = () => {
        setIsTextAreaFocused(false);
        setIsPlaceholderVisible(true);
    };

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setDescription(text);

        if (text.length >= 0 && text.length <= 500) {
            setCharCount(text.length);
        }
    };

    const handleAddFileClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if(files) {
            const fileArray = Array.from(files);

            const duplicateFiles = fileArray.filter(file => {
                return selectedFiles.some(existingFile => existingFile.name === file.name);
            });
    
            if(duplicateFiles.length > 0) {
                alert("That file has already been added!");
            } else {
                const imageFiles = fileArray.filter(file => {
                    return file.type.startsWith("image/");
                });
    
                if(imageFiles.length > 0) {
                    setSelectedFiles([...selectedFiles, ...imageFiles]);
                    const names = imageFiles.map((file) => file.name);
                    setFileNames([...selectedFileNames, ...names]);
                } else {
                    alert("Please select valid image files.");
                }
            }
        }
    };

    const handleRemoveFile = (indexToRemove: number) => {
        const updatedSelectedFiles = [...selectedFiles];
        updatedSelectedFiles.splice(indexToRemove, 1);

        const updatedFileNames = [...selectedFileNames];
        updatedFileNames.splice(indexToRemove, 1);

        setSelectedFiles(updatedSelectedFiles);
        setFileNames(updatedFileNames);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    async function generateTicketID() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const length = 8;
        let ticketID = '';
        let usedID = true;

        return new Promise(async (resolve) => {
            while(usedID) {
                for(let i = 0; i < length; i++) {
                    const randIndex = Math.floor(Math.random() * characters.length);
                    ticketID += characters.charAt(randIndex);
                }

                usedID = await checkExistingTicketID(ticketID);

                if(usedID) {
                    ticketID = '';
                }
            }

            resolve(ticketID);
            return;
        });
    }

    const handleSubmitClick = async () => {
        const email = document.querySelector('input[name="email"]') as HTMLInputElement;
        let validEmail = await validateEmail(email.value);
        let validSubject = false;
        let validDescription = false;
        let errorMsg = "Error:\n";

        if(!validEmail) {
            errorMsg += "  - Invalid email.\n";
        }

        if(selectedItem !== null) {
            validSubject = true;
        } else {
            errorMsg += "  - Please select a subject.\n";
        }

        if(charCount > 0) {
            validDescription = true;
        } else {
            errorMsg += "  - Please describe your query.\n";
        }

        if(validEmail && validSubject && validDescription) {
            const ticketID = await generateTicketID();
            const newQuery = new Query(
                ticketID,
                email.value,
                selectedItem,
                description,
                selectedFileNames
            );

            if(selectedFiles.length > 0) {
                for(let i = 0; i < selectedFiles.length; i++) {
                    await saveSupportAttachments(selectedItem, ticketID, selectedFiles[i]);
                }
            }
            
            await saveSupportInfo(newQuery);
        } else {
            alert(errorMsg);
            return;
        }
    }

    return (
        <div>
            <div className="mainContainer">
                <div className="emailContainer">
                    <label htmlFor="email" className="emailLabel">
                        Email:
                    </label>
                    <input
                        type="text"
                        name="email"
                        className="emailInput"
                    />
                </div>
                <div className="dropdownContainer">
                    <label htmlFor="dropdown" className="dropdownLabel">
                        Subject:
                    </label>
                    <div className={`dropdown ${isDropdownOpen ? 'open' : ''}`}>
                        <div className="dropdownToggle" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                            {selectedItem || 'Select an item'}
                        </div>
                        {isDropdownOpen && (
                            <ul className="dropdownMenu">
                                {topicOptions.map((item) => (
                                    <li key={item} onClick={() => handleItemClick(item)}>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="descriptionContainer">
                    <label htmlFor="description" className="descriptionLabel">
                        Description:
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        className={`descriptionTextArea ${isTextAreaFocused || description !== '' ? '' : 'placeholder'}`}
                        onFocus={handleTextAreaFocus}
                        onBlur={handleTextAreaBlur}
                        value={description}
                        onChange={handleTextAreaChange}
                        placeholder={isPlaceholderVisible ? 'Write description here...' : ''}
                    />
                    <div className="charCount">
                        {charCount}/500 characters
                    </div>
                </div>
                <div className="attachmentsAndDeleteContainer">
                    <div className="attachmentsContainer">
                        <label htmlFor="attachments" className="attachmentsLabel">
                            Attachments:
                            <button onClick={handleAddFileClick} className="addFileButton" type="button">
                                Add File
                            </button>
                        </label>
                        <input
                            ref={fileInputRef}
                            id="attachments"
                            name="attachments"
                            type="file"
                            accept="image/*"
                            onChange={handleFileInputChange}
                            style={{ display: 'none' }}
                            className="attachmentsInput"
                        />
                        <div className="fileListContainer">
                            <ul className="selectedFilesList">
                                {selectedFiles.map((file, index) => (
                                    <li key={file.name} className="fileContainer">
                                        <div className="fileInfo">
                                            <span className="fileName">
                                                {file.name.length > 30
                                                    ? file.name.substring(0, 27) + '...'
                                                    : file.name}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="deleteButtonsContainer">
                        <ul className="deleteButtonsList">
                            {selectedFiles.map((_, index) => (
                                <li key={index} className="deleteButtonContainer">
                                    <button onClick={() => handleRemoveFile(index)} className="deleteFileButton">
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="submitButtonContainer">
                    <button className="submitButton" onClick={handleSubmitClick}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Support;
