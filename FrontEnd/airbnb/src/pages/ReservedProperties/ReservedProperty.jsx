import { useState, useEffect } from "react";
import { Card, CardContent, CardMedia, Typography, Rating } from '@mui/material';



export const ReservedProperty = (props) => {

    const [ imageURL, setImageURL ] = useState( props.photos.length > 0 ? props.photos[0] : "" );
    const [ dateFrom, setDateFrom ] = useState("");
    const [ dateTo, setDateTo ] = useState("");

    useEffect( () => {
        setImageURL(props.photos.length > 0 ? props.photos[0] : "");
    }, [props.photos]);


    useEffect( () => {
        const dateFromDate = new Date(props.reservation.dateFrom);
        const stringDateFrom = `${dateFromDate.getDate()+1}/${dateFromDate.getMonth()+1}/${dateFromDate.getFullYear()}`;
        setDateFrom(stringDateFrom);
        const dateToDate = new Date(props.reservation.dateTo);
        const stringDateTo = `${dateToDate.getDate()+1}/${dateToDate.getMonth()+1}/${dateToDate.getFullYear()}`;
        setDateTo(stringDateTo);
    }, [props.reservation.dateFrom, props.reservation.dateTo])


  return (
    <Card sx={{ maxWidth: "100%", height:"100%"}}>
        {console.log(props)}
        <CardContent>
            <Typography variant="h5" component="div">
            {props.property.name}
            </Typography>
            <CardMedia
            component="img"
            height="194"
            image={imageURL}
            alt={props.property.name}
            />

            <Typography variant="body1">
            From {dateFrom} To {dateTo}
            </Typography>
            <Typography variant="body2">
            by {props.property.owner} in {props.property.location} 
            </Typography>
            <Rating value={props.score} readOnly />
            <p style={{color:"blue", marginTop:"1rem"}}>
            ${props.property.price}
            </p>
        </CardContent>
    </Card>
  )
}
