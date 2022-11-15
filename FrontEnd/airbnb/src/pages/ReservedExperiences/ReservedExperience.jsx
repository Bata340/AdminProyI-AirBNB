import { useState, useEffect } from "react";
import { Card, CardContent, CardMedia, Typography, Rating } from '@mui/material';

export const ReservedExperience = (props) => {

    const [ imageURL, setImageURL ] = useState( props.photos.length > 0 ? props.photos[0] : "" );
    const [ dateBooking, setDateBooking ] = useState("");

    useEffect( () => {
        setImageURL(props.photos.length > 0 ? props.photos[0] : "");
    }, [props.photos]);


    useEffect( () => {
        const dateBookingDate = new Date(props.reservation.dateFrom);
        const stringDateBooking = `${dateBookingDate.getDate()+1}/${dateBookingDate.getMonth()+1}/${dateBookingDate.getFullYear()}`;
        setDateBooking(stringDateBooking);
    }, [props.reservation.dateFrom] )


  return (
    <Card sx={{ maxWidth: "100%", height:"100%"}}>
        <CardContent>
            <Typography variant="h5" component="div">
            {props.experience.name}
            </Typography>
            <CardMedia
            component="img"
            height="194"
            image={imageURL}
            alt={props.experience.name}
            />

            <Typography variant="body1">
            Booking Date: {dateBooking}
            </Typography>
            <Typography variant="body2">
            by {props.experience.owner} in {props.experience.location} 
            </Typography>
            <Rating value={props.score} readOnly />
            <p style={{color:"blue", marginTop:"1rem"}}>
            ${props.experience.price}
            </p>
        </CardContent>
    </Card>
  )
}