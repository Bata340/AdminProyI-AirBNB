import * as React from 'react';
import {Card, CardContent, CardMedia, Typography, TextField } from '@mui/material'
import {useState} from 'react';
import { useEffect } from 'react';

export default function Experience (props) {

  const [imageURL, setImageURL] = useState( props.photos );

  useEffect( () => {
    setImageURL(props.photos);
  }, [props.photos]);

  return (
    <Card sx={{ maxWidth: "100%", height:"100%" }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {props.name}
        </Typography>

        <CardMedia
          component="img"
          height="194"
          image={imageURL}
          alt={props.name}
        />
        <TextField
            label="Description"
            multiline
            rows={4}
            value={props.description}
            inputProps={
                {readOnly: true}
            }
            readOnly={true}
            style={{width:"100%", marginTop: "1rem", marginBottom: "1rem"}}
        />
        <Typography variant="body2">
          by {props.owner} in {props.location}
        </Typography>
        <p style={{color:"blue", marginTop:"1rem"}}>
          U$D {props.price}
        </p>
      </CardContent>
    </Card>
  );
}
