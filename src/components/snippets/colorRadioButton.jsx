const ColorRadioButton = ({ color, selectedColor, onChange }) => {
    const isChecked = color === selectedColor;

    return (
        <>
            <input
                type="radio"
                className="form-radio hidden  text-blue-600 h-5 w-5"
                value={color}
                onChange={onChange}
                name="color"
                id={`${color}Color`}
            />
            <label
                style={{ background: `${color}` }}
                htmlFor={`${color}Color`}
                className={`h-5 w-5   border border-gray-300 ${isChecked && " border-black  border-2"} `}
            ></label>
        </>

    );
};
export default ColorRadioButton