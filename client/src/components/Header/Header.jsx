import React, { useContext, useState } from "react";
import "./Header.css";
import { BiMenuAltRight } from "react-icons/bi";
import { getMenuStyles } from "../../utils/common";
import OutsideClickHandler from "react-outside-click-handler";
import useHeaderColor from "../../hooks/useHeaderColor";
import { Link } from "react-router-dom";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import { AuthContext } from "../../context/AuthContext";
import AddPropertyModal from "../addPropertyModal/AddPropertyModal";
import { ToastContainer, toast } from "react-toastify";
const Header = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [menuOpened, setMenuOpened] = useState(false);
  const headerColor = useHeaderColor();
  const handleAddPropertyClick = () => {
    if (currentUser !== null) {
      console.log("add property clicked");
      setModalOpened(true);
    } else {
      toast.error("You have to be login!");
    }
  };
  return (
    <section className="h-wrapper" style={{ background: headerColor }}>
      <div className="innerWidth  h-container">
        {/* logo */}
        <img src="./logo.png" alt="logo" width={100} />

        {/* menu */}
        <OutsideClickHandler
          onOutsideClick={() => {
            setMenuOpened(false);
          }}>
          <div
            // ref={menuRef}
            className="h-menu"
            style={getMenuStyles(menuOpened)}>
            <Link to="/properties" className="aa">properties</Link>

            <div className="aa" onClick={handleAddPropertyClick}>Add Property</div>
            <AddPropertyModal opened={modalOpened} setOpened={setModalOpened} />
            {/* login button */}
            <a className="aa" href="mailto:foziayimam@gmail.com">Contact</a>

            {!currentUser ? (
                <Link to="/login">
                  <button className="button">Login</button>
                </Link>
            
            ) : (
              <ProfileMenu user={currentUser.user} />
            )}

          </div>
        </OutsideClickHandler>

        {/* for medium and small screens */}
        <div
          className="menu-icon"
          onClick={() => setMenuOpened((prev) => !prev)}>
          <BiMenuAltRight size={30} />
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </section>
  );
};

export default Header;
