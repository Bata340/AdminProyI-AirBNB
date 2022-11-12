import * as React from 'react';
import {Card, CardActions, CardContent, CardMedia, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import { deleteFirebaseImage } from '../../common/FirebaseHandler';

export default function MyExperience (exp) {

  const [imageURL, setImageURL] = useState( exp.photos[0] );
  const [openDialog, setOpenDialog] = useState(false);

  const API_URL = 'http://localhost:8000';

  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `/experiences/edit?id=${exp.id}`; 
    navigate(path);
  }

  useEffect( () => {
    setImageURL(exp.photos[0]);
  }, [exp.photos]);


  const handleDelete = async () => {
    for (let i=0; i<exp.photosName.length; i++){
      await deleteFirebaseImage(`files/${exp.photosName[i]}`);
    }
    const paramsDelete = {
      method: "DELETE",
      headers: {
          'Content-Type': 'application/json',
      },
      body: {
        "id": exp.id
      }
    };
    const url = `${API_URL}/experience/${exp.id}`;
    const response = await fetch(
        url,
        paramsDelete
    );
    const jsonResponse = await response.json();
    if (response.status === 200){
        if(!jsonResponse.status_code){
          window.location.reload();
        }
    }
  }

  return (
    <>
      <Card sx={{ maxWidth: "100%", height:"100%"}}>
        <CardContent>
          <Typography variant="h5" component="div">
            {exp.name}
          </Typography>

          <CardMedia
            component="img"
            height="194"
            image={imageURL}
            alt={exp.name}
          />

          <Typography variant="body1">
            {exp.description}
          </Typography>
          <Typography variant="body2">
            by {exp.owner} in {exp.location} [{exp.score}]
          </Typography>
          <p style={{color:"blue", marginTop:"1rem"}}>
            ${exp.price}
          </p>
        </CardContent>
        <CardActions>
          <Grid
            container
            justify-content="center"
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
            <Grid item xs={4}>
              <Button size="small" onClick={routeChange} variant="contained">Edit</Button>
            </Grid>
            <Grid item xs={4}>
              <Button size="small" xs={4} onClick={() => setOpenDialog(true)} variant="contained" color="error">Delete</Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete this experience?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the experiences: {exp.name}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>No</Button>
          <Button onClick={handleDelete} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
