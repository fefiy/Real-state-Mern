import React from "react";
import { getProperty } from "../../utils/api";
import { PuffLoader } from "react-spinners";
import { AiFillHeart } from "react-icons/ai";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { FaShower } from "react-icons/fa";
import { AiTwotoneCar } from "react-icons/ai";
import { MdLocationPin, MdMeetingRoom } from "react-icons/md";
import { useMutation } from "react-query";
import { removeBooking } from "../../utils/api";
import Map from "../../components/Map/Map";
import "./Property.css";
import { useState, useContext } from "react";
import BookingModal from "../../components/BookingModal/BookingModal";
import { Button } from "@mantine/core";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import Heart from "../../components/Heart/Heart";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Property = () => {
  const privateAxios = useAxiosPrivate()
  const { pathname } = useLocation();
  const id = pathname.split("/").slice(-1)[0];
  const { data, isLoading, isError } = useQuery(["resd", id], () =>
    getProperty(id)
  );
  
  const [modalOpened, setModalOpened] = useState(false);
  const {currentUser, setCurrentUser} = useContext(AuthContext)
  const user= currentUser?.user;
  console.log(user)
  const token = currentUser?.token
 const bookings = user?.bookedVisits
  console.log(user)
  console.log("bokings", bookings)
  if (isError) {
    return (
      <div className="wrapper">
        <span>Error while fetching data</span>
      </div>
    );
  }

  console.log("user", currentUser)
  const { mutate: cancelBooking, isLoading: cancelling } = useMutation({
    mutationFn: () => removeBooking(id, user?.email, token, privateAxios),
    onSuccess: () => {
      setCurrentUser((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          bookedVisits: prev.user.bookedVisits.filter((booking) => booking.id !== id),
        },
      }));
      
      localStorage.setItem("user", JSON.stringify(currentUser))
      toast.success("Booking cancelled");
    },
  });

  if (isLoading) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <PuffLoader
          height="80"
          width="80"
          radius={1}
          color="#4066ff"
          aria-label="puff-loading"
        />
      </div>
    );
  }

  return (
    <div className="wrapper" style={{marginTop:"3.5rem"}}>
      <div className="paddings flexCenter property-container innerWidth">
        <div className="like">
          <Heart id={id} />
        </div>
        <img src={data?.image} />
        <div className="property-details">
          <div className="flexColStart left">
            <div className="flexStart head">
              <span className="primaryText">{data?.title}</span>
              <span className="orangeText" style={{ fontSize: "1.5rem" }}>
                ${data?.price}
              </span>
            </div>
            <div className="flexStart facilities">
              {/* bathrooms */}
              <div className="flexStart facility">
                <FaShower size={20} color="#1F3E72" />
                <span>{data?.facilities?.bathrooms} Bathrooms</span>
              </div>

              {/* parkings */}
              <div className="flexStart facility">
                <AiTwotoneCar size={20} color="#1F3E72" />
                <span>{data?.facilities.parkings} Parking</span>
              </div>

              {/* rooms */}
              <div className="flexStart facility">
                <MdMeetingRoom size={20} color="#1F3E72" />
                <span>{data?.facilities.bedrooms} Room/s</span>
              </div>
            </div>

            {/* description */}

            <span className="secondaryText" style={{ textAlign: "justify" }}>
              {data?.description}
            </span>
            {/* address */}

            <div className="flexStart" style={{ gap: "1rem" }}>
              <MdLocationPin size={25} />
              <span className="secondaryText">
                {data?.address} {data?.city} {data?.country}
              </span>
            </div>
            
            {bookings?.map((booking) => booking.id).includes(id) ? (
              <>
                <Button
                  variant="outline"
                  w={"100%"}
                  color="red"
                  onClick={() => cancelBooking()}
                  disabled={cancelling}
                >
                  <span>Cancel booking</span>
                </Button>
                <span>
                  Your visit already booked for date{" "}
                  {bookings?.filter((booking) => booking?.id === id)[0].date}
                </span>
              </>
            ) : (
              <button
                className="button"
                onClick={() => {
                  if(currentUser == null){
                    toast.error("You have to be Logged in")
                  }else{
                    setModalOpened(true)
                  }
                }}
              >
                Book your visit
              </button>
            )}
          
            <BookingModal
              opened={modalOpened}
              setOpened={setModalOpened}
              propertyId={id}
              email={currentUser?.user?.email}
            />
          </div>
          <div className="right">
          <Map
              address={data?.address}
              city={data?.city}
              country={data?.country}
            />
          </div>
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
    </div>
  );
};

export default Property;
