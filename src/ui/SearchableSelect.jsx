import { IWL } from "@/utils/constants";
import { Input, Radio } from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";

export const SearchableSelect = ({ options = [], selected = "", onSelect = null, name = "", className="" }) => {
    const [selectedOption, setSelectedOption] = useState(selected);
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const filteredOptions = options.filter((option) =>
        option.toLowerCase().includes(search.toLowerCase())
    );

    const toggleOption = (option) => {
        setSelectedOption(option);
        setIsOpen(false); // Close after selection
    };

    useEffect(() => {
        if (onSelect) {
            onSelect(selectedOption);
        }
    }, [selectedOption]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Trigger */}
            <div className="min-h-[42px] border border-blue-gray-200 rounded-lg py-2 px-3 flex flex-wrap items-center cursor-pointer text-sm" onClick={() => setIsOpen((prev) => !prev)}>
                {selectedOption === "" ? (
                    <span className="text-fore">Select Option</span>
                ) : (
                    <span className="capitalize">{selectedOption}</span>
                )}
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-10 mt-2 w-full bg-header border border-blue-gray-200 rounded shadow-lg p-2">
                    <Input label="Search" size="sm" value={search} onChange={(e) => setSearch(e.target.value)} labelProps={{ className: IWL[0] }} containerProps={{ className: "mb-2 " + IWL[2] }} className={IWL[1]} />
                    <div className={`overflow-y-auto max-h-[200px] ${className}`}>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, key) => (
                                <label key={key} htmlFor={option} className="flex cursor-pointer items-center gap-2 p-2 hover:bg-fore/20 rounded">
                                    <Radio ripple={false} color="blue" name={name} checked={selectedOption === option} onChange={() => toggleOption(option)} id={option} containerProps={{ className: "p-0" }}  className="hover:before:content-none" />
                                    {option}
                                </label>
                            ))
                        ) : (
                            <div className="text-fore px-2 py-1">No matches found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};