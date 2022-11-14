import { Container, Grid, CircularProgress, Typography } from "@mui/material";
import React from "react";
import PropertyRequest from "./PropertyRequest";
import { getFirebaseImage } from "../../common/FirebaseHandler";
import { useEffect, useState } from "react";

export const MyPropertiesRequests = () => {
  const API_URL = "http://localhost:8000";

  const [inmuebles, setInmuebles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [urlsImages, setUrlsImages] = useState([]);
  const [propsBookings, setPropsBookings] = useState([]);
  

  async function getImagesFromFireBase(inmueblesVar) {
    const urlsArray = [];
    for (let i = 0; i < inmueblesVar.length; i++) {
      const arrayURLS = [];
      for (let j = 0; j < inmueblesVar[i].photos.length; j++) {
        const url = await getFirebaseImage(
          `files/${inmueblesVar[i].photos[j]}`
        );
        arrayURLS.push(url);
      }
      urlsArray.push(arrayURLS);
    }
    setUrlsImages(urlsArray);
    setInmuebles(inmueblesVar);
  }

  async function getPendingBookings(properties) {
    let propsBookingsLocal = [];
    for (let i = 0; i < properties.length; i++) {
      const paramsGet = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const url = `${API_URL}/property/reserveDates/${properties[i].key}?type=requested`;
      const response = await fetch(url, paramsGet);
      const jsonResponse = await response.json();
      if (response.status === 200) {
        if (!jsonResponse.status_code) {
          for (let j = 0; j < jsonResponse.message.length; j++) {
            jsonResponse.message[j].propertyId = properties[i].key;
          }
          propsBookingsLocal = [...propsBookingsLocal, ...jsonResponse.message];
        }
      }
    }
    setPropsBookings(propsBookingsLocal);
    setLoading(false);
  }

  async function getUserProperties(user) {
    const paramsUpload = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const url = `${API_URL}/properties?owner=${user}`;
    const response = await fetch(url, paramsUpload);
    const jsonResponse = await response.json();
    if (response.status === 200) {
      if (!jsonResponse.status_code) {
        const arrayProps = [];
        const keys = Object.keys(jsonResponse);
        for (let i = 0; i < keys.length; i++) {
          arrayProps.push(jsonResponse[keys[i]]);
        }
        await getImagesFromFireBase(arrayProps);
        await getPendingBookings(arrayProps);
      }
    }
  }

  const handlePropProcessed = async (bookingId) => {
    window.dispatchEvent(new Event('payment'));
    setPropsBookings(propsBookings.filter((pb) => pb.id != bookingId));
  };

  useEffect(() => {
    getUserProperties(localStorage.getItem("username"));
  }, []);

  return (
    <>
      {!loading ?
      <Container>
        <Grid container>
          {
          propsBookings.length > 0 ?
          propsBookings.map((prop, idx) => {
            const inmueble = inmuebles.filter(
              (inm) => inm.key === prop.propertyId
            )[0];
            const dateFrom = new Date(prop.dateFrom);
            const dateTo = new Date(prop.dateTo);
            return (
              <Grid
                style={{ marginTop: "2rem" }}
                item
                xs={12}
                key={`${prop.id}`}
              >
                <PropertyRequest
                  bookingId={prop.id}
                  propertyId={prop.propertyId}
                  key={`${prop.propertyId}_${prop.id}`}
                  name={inmueble.name}
                  owner={inmueble.owner}
                  price={inmueble.price}
                  user={prop.userid}
                  userScore={prop.userScore}
                  userNumOfVotes = {prop.numberOfOpinionsUser}
                  checkin={`${dateFrom.getDate()}/${
                    dateFrom.getMonth() + 1
                  }/${dateFrom.getFullYear()}`}
                  checkout={`${dateTo.getDate()}/${
                    dateTo.getMonth() + 1
                  }/${dateTo.getFullYear()}`}
                  photos={
                    urlsImages.length > 0
                      ? urlsImages[inmuebles.indexOf(inmueble)]
                      : []
                  }
                  photosName={inmueble.photos}
                  callback={handlePropProcessed}
                />
              </Grid>
            );
          })
          :
            <Grid
                style={{ marginTop: "3rem", textAlign:"center" }}
                item
                xs={12}
            >
                <h4>There are no bookings to accept or reject at the moment.</h4>
            </Grid>
        }
        </Grid>
      </Container>
      :
      <CircularProgress
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          margin: "auto",
          width: "10vw",
        }}
      />
        }
    </>
  );
};
