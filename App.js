import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import "./App.css";

function App() {
    const [jsonInput, setJsonInput] = useState("");
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    document.title = "2110DMTCSE10162";
    // Options for the dropdown
    const dropdownOptions = [
        { value: "alphabets", label: "Alphabets" },
        { value: "numbers", label: "Numbers" },
        { value: "highest_lowercase_alphabet", label: "Highest Lowercase Alphabet" },
    ];

    // Validate JSON input
    const validateJson = (input) => {
        try {
            JSON.parse(input);
            return true;
        } catch {
            return false;
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setResponseData(null);

        if (!validateJson(jsonInput)) {
            setError("Invalid JSON input. Please correct and try again.");
            return;
        }

        const parsedData = JSON.parse(jsonInput);

        try {
            const response = await axios.post("https://neww-9fe80-default-rtdb.firebaseio.com", parsedData);
            setResponseData(response.data);
        } catch (err) {
            setError("Error processing request. Please try again later.");
        }
    };

    // Filter response based on dropdown selection
    const getFilteredResponse = () => {
        if (!responseData || selectedOptions.length === 0) return null;

        const filteredResponse = {};
        selectedOptions.forEach((option) => {
            filteredResponse[option.value] = responseData[option.value];
        });

        return filteredResponse;
    };

    return (
        <div className="container">
            <h1 className="text-center">Frontend with Backend Integration</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-field">
                    <label htmlFor="json-input" className="form-label">
                        Enter JSON Input
                    </label>
                    <input
                        id="json-input"
                        type="text"
                        className="form-control"
                        placeholder='e.g., { "data": ["A", "1", "B"] }'
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>

            {error && <div className="alert alert-danger mt-3">{error}</div>}

            {responseData && (
                <div className="response-section mt-4">
                    <h3>Filter Results</h3>
                    <Select
                        options={dropdownOptions}
                        isMulti
                        onChange={setSelectedOptions}
                        className="dropdown"
                        placeholder="Select filters..."
                    />
                    <div className="mt-3">
                        <h4>Filtered Response:</h4>
                        <pre className="bg-light p-3">
                            {JSON.stringify(getFilteredResponse(), null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
