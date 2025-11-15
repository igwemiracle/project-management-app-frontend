import { Workflow } from "lucide-react";
import "./loader.css";

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <div className="loader-content">
        <div className="icon-text-wrapper">
          <div className="flex items-center gap-2">
            <div className="loader-icon-container">
              <Workflow className="loader-icon" />
            </div>
            <span className="loader-text">Planora</span>
          </div>
          <div className="loader-line"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
