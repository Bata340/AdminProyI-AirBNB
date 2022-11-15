import { useState, useEffect } from 'react';
import { Container, Grid, CircularProgress } from '@mui/material';
import { getFirebaseImage } from '../../common/FirebaseHandler';
import { ReservedExperience } from "./ReservedExperience";

export const ReservedExperiences = () => {

  const API_URL = 'http://localhost:8000';

  const [ reservationsToShow, setReservationsToShow ] = useState( [] );
  const [ loading, setLoading ] = useState( true );
  const [ urlsImages, setUrlsImages ] = useState( [] );

  async function getImagesFromFireBase( experiencesVar ){
      const urlsArray = [];
      for ( let i=0; i < experiencesVar.length ; i++ ){
          const arrayURLS = [];
          for ( let j=0; j < experiencesVar[i].photos.length ; j++ ){
              const url = await getFirebaseImage( 
                  `files/${experiencesVar[i].photos[j]}`
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
    const url = `${API_URL}/users/experiences/myReservation/${localStorage.getItem("username")}`;
    const response = await fetch(
        url,
        paramsGet
    );
    const jsonResponse = await response.json();
    if (response.status === 200){
        if(!jsonResponse.status_code){
          const arrayExps = [];
          for (let i=0; i<jsonResponse.length; i++){
            arrayExps.push(jsonResponse[i].experience);
          }
          await getImagesFromFireBase( arrayExps );
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
            <h1>My Experiences Bookings</h1>
            <Grid container justifyContent="center" alignItems="center">
              {reservationsToShow.map( (reservation, idx) => {
                return(
                  <Grid key={reservation.reservation.id} item xs={12} md={6} lg={4} style={{maringTop:"1rem"}}>
                    <ReservedExperience experience={reservation.experience} reservation={reservation.reservation} photos={ urlsImages.length > 0 ? urlsImages[idx] : []}/>
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
