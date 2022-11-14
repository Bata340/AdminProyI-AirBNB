import { useState, useEffect } from 'react';
import { Container, Grid, CircularProgress } from '@mui/material';
import { getFirebaseImage } from '../../common/FirebaseHandler';
import { ReservedProperty } from "./ReservedProperty";

export const ReservedProperties = () => {

  const API_URL = 'http://localhost:8000';

  const [ reservationsToShow, setReservationsToShow ] = useState( [] );
  const [ loading, setLoading ] = useState( true );
  const [ urlsImages, setUrlsImages ] = useState( [] );

  async function getImagesFromFireBase( inmueblesVar ){
      const urlsArray = [];
      for ( let i=0; i < inmueblesVar.length ; i++ ){
          const arrayURLS = [];
          for ( let j=0; j < inmueblesVar[i].photos.length ; j++ ){
              const url = await getFirebaseImage( 
                  `files/${inmueblesVar[i].photos[j]}`
              );
              arrayURLS.push(url);
          }
          urlsArray.push(arrayURLS);
      }
      setUrlsImages( urlsArray );
  }


  async function getBookings(){
    const paramsGet = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    };
    const url = `${API_URL}/users/myReservation/${localStorage.getItem("username")}`;
    const response = await fetch(
        url,
        paramsGet
    );
    const jsonResponse = await response.json();
    if (response.status === 200){
        if(!jsonResponse.status_code){
          const arrayProps = [];
          for (let i=0; i<jsonResponse.length; i++){
            arrayProps.push(jsonResponse[i].property);
          }
          await getImagesFromFireBase( arrayProps );
          setReservationsToShow( jsonResponse );
          setLoading( false );
        }
    }     
  }


  useEffect( () => {
    getBookings();
  // eslint-disable-next-line
  }, [] );

  return (
      <>
      {!loading ?
          <Container style={{marginTop:"3rem"}}>
            <h1>My Properties Bookings</h1>
            <Grid container justifyContent="center" alignItems="center">
              {reservationsToShow.map( (reservation, idx) => {
                return(
                  <Grid key={reservation.reservation.id} item xs={12} md={6} lg={4} style={{maringTop:"1rem"}}>
                    <ReservedProperty property={reservation.property} reservation={reservation.reservation} photos={ urlsImages.length > 0 ? urlsImages[idx] : []}/>
                  </Grid>
                );
              })}
            </Grid>
          </Container>
        :
          <CircularProgress style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            margin: 'auto',
            width: '10vw'
          }}/>
      }
      </>
  )
}
