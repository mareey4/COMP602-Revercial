//Imports
import '../Components/Support.css';
import React, { useState, useRef } from 'react';
import { 
    saveSupportInfo,
    saveSupportAttachments,
    validateEmail,
    validateDescription 
} from "../Back End/validation";
import { generateTicketID } from "../Back End/TicketGenerator";
import { useNavigate } from "react-router-dom";
import Query from "../Components/query";

// SupportComponent for App
function Support() {
    const navigate = useNavigate();

    //Array of subject/topic options
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

    // Sets the selected subject/topic
    const handleItemClick = (item: string) => {
        setSelectedItem(item);
        setIsDropdownOpen(false);
    };

    // Sets focus to true if text area has been clicked
    const handleTextAreaFocus = () => {
        setIsTextAreaFocused(true);
        setIsPlaceholderVisible(false);
    };

    // Sets focus to false if the clicked off text area
    const handleTextAreaBlur = () => {
        setIsTextAreaFocused(false);
        setIsPlaceholderVisible(true);
    };

    // Handles visual changes based on focus state of text area
    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setDescription(text);

        // Handles character count change for display within the given range
        if (text.length >= 0 && text.length <= 500) {
            setCharCount(text.length);
        }
    };

    // Sets the selected file as reference
    const handleAddFileClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Handles validity of selected file, if image file, and adds to an array
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if(files) {
            const fileArray = Array.from(files);

            // Checks for duplicate files preventing duplicates from being added to the array
            const duplicateFiles = fileArray.filter(file => {
                return selectedFiles.some(existingFile => existingFile.name === file.name);
            });
    
            if(duplicateFiles.length > 0) {
                alert("That file has already been added!");
            } else {
                // Checks file type to make sure the selected file is of type image
                const imageFiles = fileArray.filter(file => {
                    return file.type.startsWith("image/");
                });
    
                if(imageFiles.length > 0) {
                    setSelectedFiles([...selectedFiles, ...imageFiles]); // saves file to a File array
                    const names = imageFiles.map((file) => file.name);
                    setFileNames([...selectedFileNames, ...names]); // Saves file name to a String array
                } else {
                    alert("Please select valid image files.");
                }
            }
        }
    };

    // Handles removal of files from the array
    const handleRemoveFile = (indexToRemove: number) => {
        const updatedSelectedFiles = [...selectedFiles];
        updatedSelectedFiles.splice(indexToRemove, 1);

        const updatedFileNames = [...selectedFileNames];
        updatedFileNames.splice(indexToRemove, 1);

        setSelectedFiles(updatedSelectedFiles);
        setFileNames(updatedFileNames);

        // Resets selected file reference to enable the user to select previous file if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handles inputs when user clicks submit, calls functions to save inputs to database
    const handleSubmitClick = async () => {
        const email = document.querySelector('input[name="email"]') as HTMLInputElement;
        let validEmail = await validateEmail(email.value);
        let validSubject = false;
        let validDescription = await validateDescription(description);
        let errorMsg = "Error:\n";

        // Checks validity of inputs
        if(!validEmail) {
            errorMsg += "  - Invalid email.\n";
        }

        if(selectedItem !== null) {
            validSubject = true;
        } else {
            errorMsg += "  - Please select a subject.\n";
        }

        if(!validDescription) {
            errorMsg += "  - Please describe your query.\n";
        }

        // If inputs are valid saves inputs to the database
        if(validEmail && validSubject && validDescription) {
            const ticketID = await generateTicketID(); // Generates a unique randomized ticket ID
            const newQuery = new Query(
                ticketID,
                email.value,
                selectedItem,
                description,
                selectedFileNames
            );

            // If file attachments have been added, saves to firebase storage
            if(selectedFiles.length > 0) {
                for(let i = 0; i < selectedFiles.length; i++) {
                    await saveSupportAttachments(selectedItem, ticketID, selectedFiles[i]);
                }
            }
            
            await saveSupportInfo(newQuery); // Saves info to database
            alert("Your query has been sent, we will get back to you soon.");
            navigate("/create-account"); // Navigates user to Create Account page
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
                        maxLength={500}
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
                                {selectedFiles.map((file) => (
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
