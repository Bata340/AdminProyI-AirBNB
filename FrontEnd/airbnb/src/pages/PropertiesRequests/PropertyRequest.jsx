import * as React from 'react';
import {Card, CardActions, CardContent, CardMedia, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,Accordion ,AccordionDetails ,AccordionSummary  } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import { deleteFirebaseImage } from '../../common/FirebaseHandler';

export default function PropertyRequest (props) {

  const [imageURL, setImageURL] = useState( props.photos[0] );
  const [openDialog, setOpenDialog] = useState(false);

  const API_URL = 'http://localhost:8000';

  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `/properties/edit?id=${props.id}`; 
    navigate(path);
  }

  useEffect( () => {
    setImageURL(props.photos[0]);
  }, [props.photos]);


  const handleDelete = async () => {
    for (let i=0; i<props.photosName.length; i++){
      await deleteFirebaseImage(`files/${props.photosName[i]}`);
    }
    const paramsDelete = {
      method: "DELETE",
      headers: {
          'Content-Type': 'application/json',
      },
      body: {
        "id": props.id
      }
    };
    const url = `${API_URL}/property/${props.id}`;
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
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  }
  return (
    <>
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            >
            <Grid container item xs={10}>
            <Typography container item xs={4} sx={{ width: '33%', flexShrink: 0 }}>
                {props.name} 
        
                
            </Typography>
            <Typography  sx={{width: '22%', color: 'blue' }}><strong>U$D {props.price}</strong>  Per night</Typography>
            
            <Typography   sx={{ color: 'text.secondary' }}>From {props.checkin} to {props.checkout}</Typography>
            </Grid>    
            
            <Grid container item xs={1}>
              <Button size="small" onClick={routeChange} variant="contained">Accept</Button>
            </Grid>
            <Grid container item xs={1}>
              <Button size="small" xs={4} onClick={() => setOpenDialog(true)} variant="contained" color="error">Delete</Button>
            </Grid>
            </AccordionSummary>
            <AccordionDetails>
            <Grid container  item xs={12}>
                <Grid container item xs={4}>
                <Typography>
                <CardMedia
                component="img"
                height="194"
                image={imageURL}
                alt={props.name}
                />
                </Typography>
                </Grid>
                <Grid container item xs={8}>
                    <Grid container item xs={12} >
                        <h3>Candidate: {props.user}</h3>
                    </Grid>
                    <Grid container item xs={12} >
                    <Typography variant="body1">
                        <p>Score: {props.userScore}</p>
                    </Typography>
                        
                    </Grid>
                    
                    <Typography variant="body1">
                        {props.userDescription}
                    </Typography>
                </Grid>
            
                </Grid>
            </AccordionDetails>
        </Accordion>


      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete this property?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the property: {props.name}
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
