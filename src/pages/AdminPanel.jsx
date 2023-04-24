import "../scss/pages/admin.scss";
import React, { useContext, useEffect } from "react";
import TextArea from "../components/TextArea";
import Subjects from "../components/Subjects";
import ListManager from "../components/ListManager";
import Navbar from "../components/Navbar";
import { SubjectContext } from "../context/SubjectContext";
import createRipple from '../ripples';
function Panel() {
  const { data } = useContext(SubjectContext);

  useEffect(() => {
    const updateButtons = () => {
      const buttons = document.getElementsByTagName("button");
      for (const button of buttons) {
        button.addEventListener("click", createRipple);
      }
    }
    return () => {
      updateButtons()
    }
  })

  return (
    <div className="admin">
      <Navbar />
      <div className="container">
        <Subjects />
        <div className="card center">
          <div className="column">
            <TextArea subject={data.subject} />
            <ListManager subject={data.subject} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Panel;