import React, { useState } from "react";
import {
  FaSearch,
  FaBell,
  FaUser,
  FaBars,
  FaLessThanEqual,
} from "react-icons/fa";
import Modal from "./Modal";
import SearchComponent from "./SearchComponent";
import { useNavigate } from "react-router-dom";

 function Header({ isSideBarOpen, setIsSideBarOpen }) {
  const navigation = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <header className="header">
      <div className="left" onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
        {isSideBarOpen ? (
          <FaLessThanEqual className="icon" />
        ) : (
          <FaBars className="icon" />
        )}

        <span className="logo">
          <img src="logo.png" alt="" height={35} />
          VideoServe</span>
      </div>
      <div className="right">
        <FaSearch className="icon" onClick={toggleModal} />
        <FaBell className="icon"  onClick={() => navigation('/notifications')}/>
        <FaUser className="icon" onClick={() => navigation('/profile')}/>
      </div>

      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <SearchComponent />
      </Modal>
    </header>
  );
}
export default Header