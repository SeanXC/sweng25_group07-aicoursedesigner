import React from "react";
import "./roleplay.css";
import carlosImg from "../../images/nuala12.svg";
import anaImg from "../../images/nuala21.svg";

const conversation = {
  title: "Conociendo a un nuevo amigo",
  situation: "Ana y Carlos se conocen por primera vez en una cafetería.",
  dialogue: [
    { speaker: "Ana", text: "¡Hola! Me llamo Ana. ¿Y tú?", image: anaImg },
    {
      speaker: "Carlos",
      text: "¡Hola, Ana! Me llamo Carlos.",
      image: carlosImg,
    },
    { speaker: "Ana", text: "Mucho gusto, Carlos.", image: anaImg },
    {
      speaker: "Carlos",
      text: "Mucho gusto, Ana. ¿De dónde eres?",
      image: carlosImg,
    },
    { speaker: "Ana", text: "Soy de España. ¿Y tú?", image: anaImg },
    { speaker: "Carlos", text: "Soy de México.", image: carlosImg },
    {
      speaker: "Ana",
      text: "¡Qué bien! ¿Cuántos años tienes?",
      image: anaImg,
    },
    { speaker: "Carlos", text: "Tengo 20 años. ¿Y tú?", image: carlosImg },
    { speaker: "Ana", text: "Tengo 19 años.", image: anaImg },
    { speaker: "Carlos", text: "¿Estudias o trabajas?", image: carlosImg },
    {
      speaker: "Ana",
      text: "Estudio en la universidad. ¿Y tú?",
      image: anaImg,
    },
    {
      speaker: "Carlos",
      text: "También estudio en la universidad.",
      image: carlosImg,
    },
    {
      speaker: "Ana",
      text: "¡Qué coincidencia! Bueno, encantada de conocerte.",
      image: anaImg,
    },
    {
      speaker: "Carlos",
      text: "Igualmente, Ana. ¡Hasta luego!",
      image: carlosImg,
    },
    { speaker: "Ana", text: "¡Hasta luego!", image: anaImg },
  ],
};

export default function Roleplay() {
  return (
    <>
      <div>
        {/* <header
          style={{
            backgroundColor: "#8300A1",
            color: "white",
            fontSize: "1.25rem",
            fontWeight: "bold",
            padding: "1rem 1.5rem",
          }}
        >
          Home Dashboard
        </header> */}
        <main>
          <div className="roleplay-container">
            <h1 className="title">{conversation.title}</h1>
            <p className="situation">{conversation.situation}</p>
            <div className="dialogue">
              {conversation.dialogue.map((line, index) => (
                <div
                  key={index}
                  className={`dialogue-line ${line.speaker.toLowerCase()}`}
                >
                  <img
                    src={line.image}
                    alt={line.speaker}
                    className="speaker-image"
                  />
                  <div>
                    <b className="speaker">{line.speaker}: </b>
                    <span>{line.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
