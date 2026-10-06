
import React from "react";
import "../CSS/View.css";
import jerry from "../akkubaba007-jerry.mp4";

function View() {
  return (
    <div className="view-page">

      <div className="view-header">
        <p className="view-label">
         
        </p>

        <h1>
          
        </h1>

        <p>
          
        </p>
      </div>

      <div className="pov-card">

        <div className="pov-text">
          NOT POV
        </div>

        <video
          className="pov-video"
          src={jerry}
          autoPlay
          loop
          muted
          playsInline
          controls
        />

        <div className="pov-caption">
          เค้าว่ามางี้!!!
        </div>

      </div>

    </div>
  );
}

export default View;

