import {useState, useEffect} from 'react';
import {Container, Grid, Rating, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material';

export const ReviewUsers = () => {

  const [usersToReview, setUsersToReview] = useState([]);
  const [scores, setScores] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [dataDialog, setDataDialog] = useState({"user": null, "score": null})
  const API_URL = "http://localhost:8000"

  const getUsersToReview = async () => {
    const paramsGet = {
      method: "GET",
      headers: {
          'Content-Type': 'application/json',
      }
    };
    const url = `${API_URL}/reviews/get-users-to-review/${localStorage.getItem("username")}`;
    const response = await fetch(
        url,
        paramsGet
    );
    const jsonResponse = await response.json();
    if (response.status === 200){
        if(!jsonResponse.status_code){
            let scoresInitial = {};
            for (let i=0; i<jsonResponse.length; i++){
              scoresInitial = {...scoresInitial, [jsonResponse[i]]: 0};
            }
            setScores(scoresInitial);
            setUsersToReview(jsonResponse);
        }
    }    
  }


  useEffect(() => {
     getUsersToReview();
  // eslint-disable-next-line
  }, []);


  const submitReview = async (user) => {
    const paramsPatch = {
      method: "PATCH",
      headers: {
          'Content-Type': 'application/json',
      }
    };
    const url = `${API_URL}/users/score/${user}?owner_user=${localStorage.getItem("username")}&score=${scores[user]}`;
    const response = await fetch(
        url,
        paramsPatch
    );
    const jsonResponse = await response.json();
    if (response.status === 200){
        if(!jsonResponse.status_code){
          setDataDialog({"user":user, "score":scores[user]});
          setShowDialog(true);
          setUsersToReview(usersToReview.filter(userInArray => userInArray !== user));
        }
    }
  }
  
  
  return (
    <Container style={{marginTop:"3rem"}}>
        <h1 style={{textDecoration:"underline"}}>Review Occupants</h1>
        <Grid container >
          {usersToReview.length > 0 ?
          usersToReview.map(user => {
            return(
              <Grid 
                item container justifyContent="center" alignItems="center" xs={12} md={3}
                key={user} style={{border:"1px solid black", borderRadius: "10px", marginTop:"1rem"}}
              >
                <Grid item xs={12} container justifyContent="center" alignItems="center">
                  <h4>{user}</h4>
                </Grid>
                <Grid item xs={12} container justifyContent="center" alignItems="center">
                  <Rating 
                    value={scores[user] ? scores[user]: 0} 
                    onChange={(event) => {setScores({...scores, [user]:parseInt(event.target.value)});}}
                  />
                </Grid>
                <Grid item xs={12} container justifyContent="center" alignItems="center">
                  <Button style={{textAlign:"center", margin:"auto"}} onClick={() => submitReview(user)}>Submit Review</Button>
                </Grid>
              </Grid>
            )
          }): 
          <Grid item container justifyContent="center" alignItems="center" xs={12} style={{marginTop:"1rem"}}>
            <h4 style={{textAlign:"center"}}>You have no users to review yet. First you have to finish a reservation in a published property.</h4>
          </Grid>
        }
        </Grid>
        <Dialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            User Reviewed Correctly
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              The user "{dataDialog["user"]}" was correctly reviewed with a score of {dataDialog["score"]}.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDialog(false)}>Ok</Button>
          </DialogActions>
        </Dialog>
    </Container>
    
  );
}
