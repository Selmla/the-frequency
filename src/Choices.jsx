export default function Choices({ choices, onChoice }) {

    return (
        <>
            {choices.map((choice, index) => (
                <button
                    key={index} // varje knapp får en unik nyckel baserat på index
                    onClick={() => onChoice(choice.next)} // när knappen klickas, uppdatera currentId till det id som är kopplat till det valet
                >
                    {choice.text}
                </button>
            ))}
        </>
    );
}