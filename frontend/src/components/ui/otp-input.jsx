import { useEffect, useRef, useState } from "react";

const OtpInput = ({ length, onOtpChange, onAutoSubmit }) => {
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const hasSubmittedRef = useRef(false); 
    const inputRefs = useRef([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    useEffect(() => {
        const combined = otp.join("");
        onOtpChange?.(combined);

        if (combined.length === length && !otp.includes("") && !hasSubmittedRef.current) {
            hasSubmittedRef.current = true;
            onAutoSubmit?.(combined);
        } else if (combined.length < length || otp.includes("")) {
            hasSubmittedRef.current = false;
        }
    }, [otp]);


    const handleChange = (index, e) => {
        const value = e.target.value;

        if (!/^\d*$/.test(value)) return;    // if not number in input then return

        // change value
        const newOtp = [...otp];    // shallow copy to use for next iteration
        newOtp[index] = value.substring(value.length - 1); // start with index => value.length-1 => helps in entering 1 value each input
        setOtp(newOtp);             // change to main state 

        // submit value
        const combinedOtp = newOtp.join("");
        onOtpChange?.(combinedOtp);

        // if there is any empty input boxes then move cursor to that empty input field box 
        const firstEmptyIndex = newOtp.indexOf("");
        if (index > 0 && firstEmptyIndex !== -1 && firstEmptyIndex < index) {
            // If there's an earlier empty field, focus it
            inputRefs.current[firstEmptyIndex]?.focus();
            return;
        }

        // const combinedOtp = newOtp.join("");
        // if (combinedOtp.length == length) {
        //     console.log(combinedOtp);
        // }

        // Cursor move
        // 1) if next element is there in input box
        while(index<length-1 && newOtp[index+1]){
            index = index+1;
        }

        // 2) just move it
        if (value && index < length - 1 && inputRefs.current[index + 1]) {
            // if value exists in current input field && index less than last input element && if input element exists [for last input element condition]
            inputRefs.current[index + 1].focus();
        }
    }

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").trim();
    
        if (!/^\d+$/.test(pasteData)) return; // only digits
    
        const pasteArray = pasteData.slice(0, length).split(""); // take only 'length' digits
        const newOtp = [...otp];
    
        for (let i = 0; i < pasteArray.length; i++) {
            newOtp[i] = pasteArray[i];
            if (inputRefs.current[i]) {
                inputRefs.current[i].value = pasteArray[i];
            }
        }
    
        setOtp(newOtp);
    
        const filledTill = pasteArray.length - 1;
        if (inputRefs.current[filledTill]) {
            inputRefs.current[filledTill].focus();
        }
    
        const combinedOtp = newOtp.join("");
        if (combinedOtp.length === length) {
            console.log("Auto-submitted OTP:", combinedOtp);
        }
    };
    
    const handleClick = (index) => {
        inputRefs.current[index].setSelectionRange(1, 1);
    }

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace") {
            e.preventDefault();         
            // To stop the browser’s default behavior
            // normally: Deletes the previous character inside the input.
            // But we want to remove conditionally

            const newOtp = [...otp];
            
            if(otp[index]){
                newOtp[index] = "";
                setOtp(newOtp);
                onOtpChange?.(newOtp.join(""));
            } 
            else if (index > 0 && inputRefs.current[index - 1]){
                inputRefs.current[index - 1].focus();
            }
        }
    };

    return (
        <div className="flex gap-2 justify-center">
            {otp.map((value, index) => {
                return (
                    <input
                        key={index}
                        type="text"
                        ref={(input) => (inputRefs.current[index] = input)}
                        value={value}
                        onChange={(e) => handleChange(index, e)}
                        onClick={() => handleClick(index)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined} 
                        className="w-12 h-12 text-center border rounded-md text-lg font-medium focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all duration-200"
                    />
                );
            })}
        </div>
    )
}

export default OtpInput;