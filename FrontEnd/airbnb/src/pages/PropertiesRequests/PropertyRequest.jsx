import * as React from 'react';
import {CardMedia, Grid, Accordion ,AccordionDetails ,AccordionSummary, Rating, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions, Button  } from '@mui/material';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useState, useEffect} from 'react';

export default function PropertyRequest (props) {

  const [imageURL, setImageURL] = useState( props.photos[0] );
  const [openDialog, setOpenDialog] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [functionHandleDialog, setFunctionHandleDialog] = useState({});
  const [acceptOrReject, setAcceptOrReject] = useState("");
  const API_URL = 'http://localhost:8000';
  

  const processBooking = async (type) => {
    const paramsPost = {
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
      },
    };
    const url = `${API_URL}/users/reservation/${props.bookingId}?status=${type}&propertyId=${props.propertyId}`;
    const response = await fetch(
        url,
        paramsPost
    );
    const jsonResponse = await response.json();
    if (response.status === 200){
        if(!jsonResponse.status_code){
          props.callback(props.bookingId);
        }
    } 
  }

  const acceptBooking = async () => {
    setAcceptOrReject("accept");
    setFunctionHandleDialog({callback:() => {processBooking("accepted"); }});
    setOpenDialog(true);
  }

  const rejectBooking = async () => {
    setAcceptOrReject("reject");
    setFunctionHandleDialog({callback: () => {processBooking("rejected")}});
    setOpenDialog(true);
  }


  useEffect( () => {
    setImageURL(props.photos[0]);
  }, [props.photos]);

  
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
              <Typography sx={{ width: '33%', flexShrink: 0 }}>
                  {props.name} 
              </Typography>
              <Typography sx={{width: '22%', color: 'blue' }}><strong>U$D {props.price}</strong>  Per night</Typography>
              
              <Typography sx={{ color: 'text.secondary' }}>From {props.checkin} to {props.checkout}</Typography>
            </Grid>    
            
            <Grid container item xs={1}>
              <Button size="small" onClick={acceptBooking} variant="contained">Accept</Button>
            </Grid>
            <Grid container item xs={1}>
              <Button size="small" onClick={rejectBooking} variant="contained" color="error">Delete</Button>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
          <Grid container>
              <Grid item xs={4}>
                <Typography>
                  <CardMedia
                    component="img"
                    height="194"
                    image={imageURL}
                    alt={props.name}
                  />
                </Typography>
              </Grid>
              <Grid container item xs={8} style={{borderLeft:"1px solid gray", paddingLeft:"2rem"}}>
                  <Grid item xs={6} >
                    <h4>User requesting:<br/><strong>{props.user}</strong></h4>
                  </Grid>
                  <Grid item xs={6} >
                    <h4 style={{marginRight:"1rem"}}>User Opinions: </h4>
                    <Rating value={props.userScore} readOnly/>
                    <Typography>{props.userNumOfVotes} opinion{props.userNumOfVotes !== 1? "s" : null}</Typography>
                      
                  </Grid>
                  
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
          {acceptOrReject.charAt(0).toUpperCase()+acceptOrReject.slice(1)+" this booking?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to {acceptOrReject} this booking? This can not be reverted
            later.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>No</Button>
          <Button onClick={() => functionHandleDialog.callback()} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
