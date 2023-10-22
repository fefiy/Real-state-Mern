import { Container, Modal, Stepper } from "@mantine/core";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import AddLocation from "../AddLocation/AddLocation";
import UploadImage from "../UploadImage/UploadImage";
import Facilities from "../Facilities/Facilities";
import BasicDetails from "../BasicDetails/BasicDetails";

const AddPropertyModal = ({ opened, setOpened }) => {
    const {currentUser} = useContext(AuthContext)
    const user = currentUser?.user
    const [active, setActive] = useState(0);
    const [propertyDetails, setPropertyDetails] = useState({
        title: "",
        description: "",
        price: 0,
        country: "",
        city: "",
        address: "",
        image: null,
        facilities: {
          bedrooms: 0,
          parkings: 0,
          bathrooms: 0,
        },
        userEmail: user?.email,
      });
      const nextStep = () => {
        setActive((current) => (current < 4 ? current + 1 : current));
      };
    
      const prevStep = () => {
        setActive((current) => (current > 0 ? current - 1 : current));
      };
  return (
    <Modal
    opened={opened}
    onClose={() => setOpened(false)}
    closeOnClickOutside
    size={"90rem"}
    >
       <Container h={"40rem"} w={"100%"}>
        <Stepper
          active={active}
          onStepClick={setActive}
          breakpoint="sm"
          allowNextStepsSelect={false}
        >
          <Stepper.Step label="Location" description="Address">
            <AddLocation
              nextStep={nextStep}
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
            />
          </Stepper.Step>
          <Stepper.Step label="Images" description="Upload ">
            <UploadImage
              prevStep={prevStep}
              nextStep={nextStep}
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
            />
          </Stepper.Step>
          <Stepper.Step label="Basics" description="Details">
            
          <BasicDetails
              prevStep={prevStep}
              nextStep={nextStep}
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
            />
          </Stepper.Step>

          <Stepper.Step>
            <Facilities
              prevStep={prevStep}
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
              setOpened={setOpened}
              setActiveStep={setActive}
            />
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>
      </Container>
    </Modal>
  )
}

export default AddPropertyModal