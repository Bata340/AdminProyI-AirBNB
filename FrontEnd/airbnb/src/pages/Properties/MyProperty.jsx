import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

export default function MyProperty (props) {

  const [imageURL, setImageURL] = useState( props.photos );

  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `/properties/edit`; 
    navigate(path);
  }

  useEffect( () => {
    setImageURL(props.photos);
  }, [props.photos]);

  return (
    <Card sx={{ maxWidth: 275 }}>
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

        <Typography variant="body1">
          {props.description}
        </Typography>
        <Typography variant="body2">
          by {props.owner} in {props.location} [{props.score}]
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">${props.price}</Button>
        <Button size="small" onClick={routeChange}>Editar</Button>
      </CardActions>
    </Card>
  );
}
