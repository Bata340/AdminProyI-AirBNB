import { useState, useEffect } from 'react';
import { Container, Grid, CircularProgress } from '@mui/material';
import { getFirebaseImage } from '../../common/FirebaseHandler';
import { ReservedExperience } from "../ReservedExperiences/ReservedExperience";

export const ExperiencesScheduleView = () => {
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
    const url = `${API_URL}/experiences/bookings-accepted/${localStorage.getItem("username")}`;
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
            {reservationsToShow.length > 0 ?
            <Grid container justifyContent="center" alignItems="center" spacing={4}>
              {reservationsToShow.map( (reservation, idx) => {
                return(
                  <Grid key={reservation.reservation.id} item xs={12} md={6} lg={4} style={{maringTop:"1rem"}}>
                    <ReservedExperience schedule={false} experience={reservation.experience} reservation={reservation.reservation} photos={ urlsImages.length > 0 ? urlsImages[idx] : []}/>
                  </Grid>
                );
              })}
            </Grid>
            :
            <h4 style={{textAlign:"center"}}>You have no bookings in your experiences yet.</h4>
            }
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
