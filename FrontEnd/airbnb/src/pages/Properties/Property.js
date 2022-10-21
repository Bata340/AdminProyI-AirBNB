import * as React from 'react';
//import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function Property(props) {
  return (
    <Card sx={{ maxWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {props.name}
        </Typography>

        <CardMedia
          component="img"
          height="194"
          image={props.photos}
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
      </CardActions>
    </Card>
  );
}
