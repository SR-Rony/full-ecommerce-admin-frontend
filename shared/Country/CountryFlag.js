import ReactCountryFlag from "react-country-flag";

const CountryFlag = ({country}) =>{
    return (
            <ReactCountryFlag
                className="emojiFlag"
                countryCode={country?.value|| "US"}
                style={{
                    fontSize: '1.5em',
                    lineHeight: '1.5em',
                }}
                aria-label={country?.label}
            />
    );
};

export default CountryFlag;
