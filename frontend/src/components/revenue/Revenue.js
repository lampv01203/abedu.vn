// frontend/src/components/Income.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import TeacherSalary from "./TeacherSalary";

const Revenue = () => {
  const [activeTab, setActiveTab] = useState("home"); // Track active tab

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="card card-primary card-tabs">
      <div className="card-header p-0 pt-1">
        <ul className="nav nav-tabs" id="custom-tabs-one-tab" role="tablist">
          <li className="nav-item">
            <Link
              className={`nav-link revenue ${activeTab === "home" ? "active" : ""}`}
              id="custom-tabs-one-home-tab"
              to="#"
              role="tab"
              onClick={() => handleTabClick("home")}
              aria-controls="custom-tabs-one-home"
              aria-selected={activeTab === "home"}
            >
              Bảng Lương Cơ Sở
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link revenue ${activeTab === "income" ? "active" : ""}`}
              id="custom-tabs-one-income-tab"
              to="#"
              role="tab"
              onClick={() => handleTabClick("income")}
              aria-controls="custom-tabs-one-income"
              aria-selected={activeTab === "income"}
            >
              Thu
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link revenue ${activeTab === "expenditure" ? "active" : ""}`}
              id="custom-tabs-one-expenditure-tab"
              to="#"
              role="tab"
              onClick={() => handleTabClick("expenditure")}
              aria-controls="custom-tabs-one-expenditure"
              aria-selected={activeTab === "expenditure"}
            >
              Chi
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link revenue ${activeTab === "total" ? "active" : ""}`}
              id="custom-tabs-one-total-tab"
              to="#"
              role="tab"
              onClick={() => handleTabClick("total")}
              aria-controls="custom-tabs-one-total"
              aria-selected={activeTab === "total"}
            >
              Tổng hợp
            </Link>
          </li>
        </ul>
      </div>
      <div className="tab-content" id="custom-tabs-one-tabContent">
        <div
          className={`tab-pane fade ${activeTab === "home" ? "active show" : ""}`}
          id="custom-tabs-one-home"
          role="tabpanel"
          aria-labelledby="custom-tabs-one-home-tab"
        >
          <TeacherSalary />
        </div>
        <div
          className={`tab-pane fade ${activeTab === "income" ? "active show" : ""}`}
          id="custom-tabs-one-income"
          role="tabpanel"
          aria-labelledby="custom-tabs-one-income-tab"
        >
          <Income/>
        </div>
        <div
          className={`tab-pane fade ${activeTab === "expenditure" ? "active show" : ""}`}
          id="custom-tabs-one-expenditure"
          role="tabpanel"
          aria-labelledby="custom-tabs-one-expenditure-tab"
        >
          <p>
            Morbi turpis dolor, vulputate vitae felis non, tincidunt congue
            mauris. Phasellus volutpat augue id mi placerat mollis.
          </p>
        </div>
        <div
          className={`tab-pane fade ${activeTab === "total" ? "active show" : ""}`}
          id="custom-tabs-one-total"
          role="tabpanel"
          aria-labelledby="custom-tabs-one-total-tab"
        >
          <p>
            Pellentesque vestibulum commodo nibh nec blandit. Maecenas neque
            magna, iaculis tempus turpis ac, ornare sodales tellus.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
