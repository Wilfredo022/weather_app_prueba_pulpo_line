import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import "./HeaderTitle.css";

export const HeaderTitle = ({ title }: { title: string }) => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="header-container">
      <button onClick={handleBack}>
        <ArrowLeftIcon className="icon" />
      </button>
      <h2>{title}</h2>
    </div>
  );
};
