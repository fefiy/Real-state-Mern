import React, { useContext, useState } from "react";
import { Modal, Button } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useMutation } from "react-query";
import { bookVisit } from "../../utils/api.js";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { AuthContext } from "../../context/AuthContext.jsx";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.jsx";

const BookingModal = ({ opened, setOpened, email, propertyId }) => {
 const privateAxios = useAxiosPrivate()
 const [value, setValue] = useState(null);
 const {currentUser, setCurrentUser} = useContext(AuthContext)
 const token = currentUser?.token
 console.log("modal token",token)
  const handleBookingSuccess = () => {
    toast.success("You have booked your visit", {
      position: "bottom-right",
    });
    setCurrentUser((prev) => ({
      ...prev,
      user:{
        ...prev.user,
        bookedVisits: [
          ...prev.user.bookedVisits,
          {
            id: propertyId,
            date: dayjs(value).format("DD/MM/YYYY"),
          },
        ],
      }
    }));

    localStorage.setItem("user", JSON.stringify(currentUser))
  };
  console.log("bokking modal property id", propertyId)

  console.log(currentUser)

  const { mutate, isLoading } = useMutation({
    mutationFn: () => bookVisit(value, propertyId, email, token, privateAxios),
    onSuccess: () => handleBookingSuccess(),
    onError: ({ response }) => toast.error(response.data.message),
    onSettled: () => setOpened(false),
  });

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Select your date of visit"
      centered
    >
      <div className="flexColCenter" style={{gap: "1rem"}}>
        <DatePicker value={value} onChange={setValue} minDate={new Date()} />
        <Button disabled={!value || isLoading} onClick={() => mutate()}>
          Book visit
        </Button>
      </div>
    </Modal>
  );
};

export default BookingModal;