export default function Scene({ scene }) {

  return (
    <>
    {scene.content.map((item, index) => (
      <p key={index}>{item.text}</p> // visar texten i scenen
    ))}
    </>
  );
}