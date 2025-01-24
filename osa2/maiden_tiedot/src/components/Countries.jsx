const Countries = ({ countries, handleClick }) => {
    return (
        <div>
            {countries.map(country => (
                <p key={country.name.common}>
                    {country.name.common}
                    <button onClick={() => handleClick(country.name.common)}>show</button>
                </p>
            ))}
        </div>
    )
}
export default Countries